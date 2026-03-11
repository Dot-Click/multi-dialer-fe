import React, { useState, useEffect } from 'react';
import { FiX, FiChevronDown } from 'react-icons/fi';
import { useCallerIds, type CallerId } from '@/hooks/useSystemSettings';
import { useMediaCenter, type MediaCenterItem } from '@/hooks/useMediaCenter';
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
  const { getMediaCenterItems } = useMediaCenter();

  const [_recordings, setRecordings] = useState<MediaCenterItem[]>([]);
  const [dialerType, setDialerType] = useState<'PREDICTIVE' | 'POWER' | 'PREVIEW'>('POWER');
  const [aiPacing, setAiPacing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Agent State
  const [agents, setAgents] = useState<{ id: string; fullName: string; email: string }[]>([]);
  const [selectedAgentIds, setSelectedAgentIds] = useState<string[]>([]);
  const [isLoadingAgents, setIsLoadingAgents] = useState(false);
  const { data: session } = authClient.useSession();

  // Selected values
  const [selectedNumber, setSelectedNumber] = useState('');
  const [selectedLines, setSelectedLines] = useState('1');

  useEffect(() => {
    if (isOpen) {
      getMediaCenterItems().then(items => {
        const audioItems = items.filter(item => item.fileCategory === 'audio');
        setRecordings(audioItems);
      });

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
                email: u.email
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
      setSelectedLines(String(createdCallerId.numberOfLines || 1));
      setDialerType(createdCallerId.dialerType || 'POWER');
      setAiPacing(createdCallerId.aiPacing || false);
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
        setSelectedLines(String(target.numberOfLines || 1));
        setDialerType(target.dialerType || 'POWER');
        setAiPacing(target.aiPacing || false);
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
          numberOfLines: parseInt(selectedLines),
          dialerType,
          aiPacing,
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
          <h2 className="text-[18px] font-bold text-gray-800 dark:text-white">Number Settings</h2>
          <button onClick={onClose} className="p-1.5 bg-gray-100 dark:bg-slate-700 rounded-lg text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"><FiX size={18} /></button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
          {/* Selectors Section */}
          <div className="space-y-3">
            {/* Number of Lines Dropdown */}
            <div className="bg-[#F3F4F8] dark:bg-slate-700 rounded-xl px-4 py-2.5 relative">
              <label className="text-[10px] font-extrabold text-[#9CA3AF] dark:text-gray-500 uppercase tracking-wider block">Number of Lines</label>
              <div className="relative mt-0.5">
                <select
                  value={selectedLines}
                  onChange={(e) => setSelectedLines(e.target.value)}
                  className="w-full bg-transparent appearance-none text-[13px] font-bold text-gray-700 dark:text-gray-300 outline-none pr-8 cursor-pointer"
                >
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 12].map(num => (
                    <option key={num} value={num}>{num}</option>
                  ))}
                </select>
                <FiChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
              </div>
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
                    </label>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-3">
            <h3 className="text-[14px] font-bold text-gray-900 dark:text-white border-l-4 border-yellow-400 pl-2">Dialer Settings</h3>
            {[
              { id: 'PREDICTIVE', title: 'Predictive Dialing', desc: 'AI-driven call pacing\nAutomatically adjusts based on availability' },
              { id: 'POWER', title: 'Power Dialing', desc: 'Dials one number at a time\nAutomatically dials next contact' },
              { id: 'PREVIEW', title: 'Preview Dialing', desc: 'Agent views contact details before dialing\nAgent manually initiates each call' },
            ].map((option) => (
              <div
                key={option.id}
                onClick={() => setDialerType(option.id as any)}
                className={`p-4 rounded-2xl flex gap-4 cursor-pointer border-2 transition-all ${dialerType === option.id ? 'bg-[#F9FAFB] border-yellow-400' : 'bg-[#F3F4F8] border-transparent hover:border-gray-200'}`}
              >
                <div className="mt-1">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${dialerType === option.id ? 'border-yellow-500' : 'border-gray-300'}`}>
                    {dialerType === option.id && <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />}
                  </div>
                </div>
                <div>
                  <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">{option.title}</h4>
                  <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1.5 whitespace-pre-line leading-relaxed font-medium">{option.desc}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-4 p-4 bg-yellow-50/50 dark:bg-yellow-900/10 rounded-2xl border border-yellow-100 dark:border-yellow-900/30">
            <input
              type="checkbox"
              checked={aiPacing}
              onChange={() => setAiPacing(!aiPacing)}
              className="mt-1 w-5 h-5 rounded border-gray-300 text-yellow-500 focus:ring-yellow-400 cursor-pointer"
            />
            <div>
              <h4 className="text-[14px] font-bold text-gray-900 dark:text-white">Enable AI Call Pacing</h4>
              <p className="text-[11px] text-gray-500 dark:text-gray-400 mt-1 leading-relaxed font-medium">AI adjusts outbound calling lines based on pickup rate to optimize efficiency.</p>
            </div>
          </div>

          <div className="bg-[#EEF2FF] dark:bg-blue-900/20 border border-[#E0E7FF] dark:border-blue-800 p-4 rounded-2xl text-[11px] font-bold text-[#4F46E5] dark:text-blue-400 flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-500 dark:bg-blue-400 animate-pulse"></div>
            Each dial will automatically send an email and text using the selected templates.
          </div>
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
            ) : 'Start Dialing'}
          </button>
        </div>
      </div>
      <style>{`.custom-scrollbar::-webkit-scrollbar { width: 4px; } .custom-scrollbar::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 10px; }`}</style>
    </div >
  );
};

export default NumberSettingsModal;
