import React, { useState, useEffect } from 'react';
import { FiX, FiSettings } from 'react-icons/fi';
import api from '@/lib/axios';
import { useCallerIds, type CallerId } from '@/hooks/useSystemSettings';
// import { useMediaCenter, type MediaCenterItem } from '@/hooks/useMediaCenter';
import toast from 'react-hot-toast';
import { Loader2, Users } from 'lucide-react';
import { authClient } from '@/lib/auth-client';

interface NumberSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  createdCallerId?: CallerId | null;
}

const NumberSettingsModal: React.FC<NumberSettingsModalProps> = ({ isOpen, onClose, createdCallerId }) => {
  const { data: callerIds, updateCallerId } = useCallerIds();
  // const { getMediaCenterItems } = useMediaCenter();

  const [callerIdLabel, setCallerIdLabel] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  // Agent State
  const [agents, setAgents] = useState<{ id: string; fullName: string; email: string; defaultCallerId?: string | null }[]>([]);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const { data: session } = authClient.useSession();

  // Selected values
  const [selectedNumber, setSelectedNumber] = useState('');

  useEffect(() => {
    if (isOpen) {
      // No recordings needed here anymore

      // Fetch Agents using Better Auth Admin Plugin
      const fetchAgents = async () => {
        if (!session?.user?.id) return;
        setIsLoadingAgents(true);
        try {
          const { data, error } = await authClient.admin.listUsers({
            query: {
              limit: 100,
            }
          });

          if (error) {
            console.error("Failed to fetch users via Better Auth:", error);
            return;
          }

          if (data && data.users) {
            // Filter: Role must be AGENT and createdById must match current admin's ID
            const filteredAgents = data.users
              .filter((u: any) =>
                u.role?.toUpperCase() === 'AGENT' &&
                u.createdById === session.user.id
              )
              .map((u: any) => ({
                id: u.id,
                fullName: u.fullName || u.name || 'Unknown Agent',
                email: u.email,
                defaultCallerId: u.defaultCallerId
              }));

            setAgents(filteredAgents);
          }
        } catch (err) {
          console.error("Error fetching agents:", err);
        } finally {
          setIsLoadingAgents(false);
        }
      };

      fetchAgents();
    }
  }, [isOpen, session?.user?.id]);

  useEffect(() => {
    if (createdCallerId) {
      setSelectedNumber(createdCallerId.twillioNumber || '');
      setCallerIdLabel(createdCallerId.label || '');
      setSelectedAgentIds(createdCallerId.agents?.map(a => a.id) || []);
    } else if (callerIds && callerIds.length > 0 && !selectedNumber) {
      const first = callerIds[0];
      setSelectedNumber(first.twillioNumber || '');
    }
  }, [createdCallerId, callerIds, isOpen]);

  useEffect(() => {
    if (selectedNumber && callerIds) {
      const target = callerIds.find(c => c.twillioNumber === selectedNumber);
      if (target) {
        setCallerIdLabel(target.label || '');
        setSelectedAgentIds(target.agents?.map(a => a.id) || []);
      }
    }
  }, [selectedNumber, callerIds]);

  if (!isOpen) return null;

  const handleStartDialing = async () => {
    // Find the record ID for the selected number string
    const targetRecord = callerIds?.find(c => c.twillioNumber === selectedNumber);
    if (!targetRecord) {
      toast.error('Please select a valid Number');
      return;
    }

    setIsSaving(true);
    try {
      await updateCallerId.mutateAsync({
        id: targetRecord.id,
        data: {
          label: callerIdLabel,
          agentIds: selectedAgentIds,
          status: 'Healthy' as any
        }
      });
      toast.success('Settings saved successfully');
      onClose(); // In a real app, this might also trigger the dialer start
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to save settings');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-900 flex items-center justify-center bg-black/30 backdrop-blur-[2px] p-4 font-sans">
      <div className="bg-white dark:bg-slate-800 w-full max-w-[480px] max-h-[92vh] rounded-[32px] shadow-2xl overflow-hidden flex flex-col animate-in fade-in zoom-in duration-200 border dark:border-slate-700">
        <div className="px-6 py-5 flex justify-between items-center border-b border-gray-50 dark:border-slate-700">
          <h2 className="text-[18px] font-bold text-gray-800 dark:text-white">Caller ID Settings</h2>
          <button onClick={onClose} className="p-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><FiX size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Selectors Section */}
          <div className="space-y-3">
            {/* Caller ID Label Input */}
            <div className="bg-[#F3F4F8] dark:bg-slate-700 rounded-xl px-4 py-2.5">
              <label className="text-[10px] font-extrabold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-wider block">Caller ID Name / Label</label>
              <input
                type="text"
                value={callerIdLabel}
                onChange={(e) => setCallerIdLabel(e.target.value)}
                placeholder="Enter label (e.g. Primary Line)"
                className="w-full bg-transparent text-[13px] font-bold text-gray-700 dark:text-gray-300 outline-none mt-1"
              />
            </div>



            {/* Agent Selection */}
            <div className="bg-[#F3F4F8] dark:bg-slate-700 rounded-xl px-4 py-3 relative">
              <div className="flex items-center gap-2 mb-2">
                <Users size={14} className="text-yellow-600" />
                <label className="text-[10px] font-extrabold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-wider block">Assign Agents</label>
              </div>

              {isLoadingAgents ? (
                <div className="flex items-center justify-center py-4">
                  <Loader2 size={20} className="animate-spin text-yellow-500" />
                </div>
              ) : agents.length === 0 ? (
                <p className="text-[11px] text-gray-400 py-2">No agents found created by you.</p>
              ) : (
                <div className="space-y-2 max-h-[150px] overflow-y-auto custom-scrollbar pr-2">
                  {agents.map(agent => (
                    <label
                      key={agent.id}
                      className={`flex items-center gap-3 p-2.5 rounded-lg cursor-pointer transition-all border ${selectedAgentIds.includes(agent.id) ? 'bg-white dark:bg-slate-800 border-yellow-300 dark:border-yellow-600 shadow-sm' : 'bg-transparent border-transparent hover:bg-gray-100 dark:hover:bg-slate-600'}`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedAgentIds.includes(agent.id)}
                        onChange={() => {
                          setSelectedAgentIds(prev =>
                            prev.includes(agent.id)
                              ? prev.filter(id => id !== agent.id)
                              : [...prev, agent.id]
                          );
                        }}
                        className="w-4 h-4 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-[12px] font-bold text-gray-800 dark:text-white truncate">{agent.fullName}</p>
                        <p className="text-[10px] text-gray-500 dark:text-gray-400 truncate">{agent.email}</p>
                      </div>
                      {selectedAgentIds.includes(agent.id) && (
                        <button
                          title={agent.defaultCallerId === (createdCallerId?.id || callerIds?.find(c => c.twillioNumber === selectedNumber)?.id) ? "Primary Caller ID" : "Set as Primary"}
                          onClick={async (e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            const cid = createdCallerId?.id || callerIds?.find(c => c.twillioNumber === selectedNumber)?.id;
                            if (!cid) return;
                            try {
                              await api.put(`/user/${agent.id}`, { defaultCallerId: cid });
                              setAgents(prev => prev.map(a => a.id === agent.id ? { ...a, defaultCallerId: cid } : a));
                              toast.success(`Set as primary for ${agent.fullName}`);
                            } catch (err) {
                              toast.error('Failed to set default caller ID');
                            }
                          }}
                          className={`p-1.5 rounded-lg transition-colors ${agent.defaultCallerId === (createdCallerId?.id || callerIds?.find(c => c.twillioNumber === selectedNumber)?.id) ? 'text-yellow-500 bg-yellow-50' : 'text-gray-300 hover:text-yellow-500 hover:bg-gray-100'}`}
                        >
                          <FiSettings size={14} />
                        </button>
                      )}
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Dialer Settings removed as per request */}
        </div>

        <div className="p-6 border-t border-gray-50 dark:border-slate-700 flex gap-4">
          <button onClick={onClose} className="flex-1 bg-[#F3F4F6] dark:bg-slate-700 hover:bg-gray-200 dark:hover:bg-slate-600 text-gray-900 dark:text-white text-[15px] font-bold py-4 rounded-2xl transition-all">Cancel</button>
          <button
            onClick={handleStartDialing}
            disabled={isSaving || !selectedNumber}
            className="grow-2 bg-[#FECD56] hover:bg-[#F0D500] text-gray-900 text-[15px] font-extrabold py-4 rounded-2xl shadow-md transition-all disabled:opacity-50"
          >
            {isSaving ? (
              <span className="flex items-center justify-center gap-2">
                <Loader2 size={18} className="animate-spin" />
                Saving...
              </span>
            ) : 'Update Settings'}
          </button>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }`}</style>
    </div >
  );
};

export default NumberSettingsModal;
