import React, { useRef, useState } from 'react';
import { FiPlus, FiSearch, FiMoreHorizontal, FiSettings, FiTrash2 } from 'react-icons/fi';
import { BiSortAlt2 } from 'react-icons/bi';
import { Modal, message } from 'antd';
import AddCallScoutNumberModal from './AddCallScoutNumberModal';
import NumberSettingsModal from './NumberSettingsModal';
import { useCallerIds } from '@/hooks/useSystemSettings';

// ── Per-row context menu ──────────────────────────────────────────────────────

interface RowMenuProps {
  onSettings: () => void;
  onDelete: () => void;
}

const RowMenu: React.FC<RowMenuProps> = ({ onSettings, onDelete }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen((o) => !o)}
        className="text-gray-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-700 hover:text-gray-600 dark:hover:text-gray-200 transition-all opacity-0 group-hover:opacity-100"
      >
        <FiMoreHorizontal size={18} />
      </button>

      {open && (
        <div className="absolute right-0 mt-1 z-20 bg-white dark:bg-slate-800 border border-gray-100 dark:border-slate-700 rounded-xl shadow-lg w-44 py-1 overflow-hidden">
          <button
            onClick={() => { onSettings(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
          >
            <FiSettings size={14} className="text-yellow-500" />
            Number Settings
          </button>
          <div className="h-px bg-gray-100 dark:bg-slate-700 mx-3" />
          <button
            onClick={() => { onDelete(); setOpen(false); }}
            className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
          >
            <FiTrash2 size={14} />
            Delete
          </button>
        </div>
      )}
    </div>
  );
};

// ── Main CallerId Component ───────────────────────────────────────────────────

const CallerId: React.FC = () => {
  const { data: callerIds, isLoading, isError, error, deleteCallerId } = useCallerIds();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [selectedCallerId, setSelectedCallerId] = useState<any>(null);

  // Called after adding a new number — auto-opens settings for it
  const handleAddNumberSuccess = (callerId: any) => {
    setIsAddModalOpen(false);
    setSelectedCallerId(callerId);
    setIsSettingsModalOpen(true);
  };

  // Called from the three-dot menu on an existing row
  const handleOpenSettings = (callerId: any) => {
    setSelectedCallerId(callerId);
    setIsSettingsModalOpen(true);
  };

  const handleDelete = (callerId: any) => {
    Modal.confirm({
      title: 'Delete Caller ID',
      content: `Are you sure you want to delete "${callerId.label || callerId.twillioNumber || 'this number'}"? This cannot be undone.`,
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: async () => {
        try {
          await deleteCallerId.mutateAsync(callerId.id);
          message.success('Caller ID deleted.');
        } catch (err: any) {
          message.error(err?.response?.data?.message || 'Failed to delete Caller ID.');
        }
      },
    });
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500 dark:text-gray-400">Loading Caller IDs...</div>;
  if (isError) return <div className="p-8 text-center text-red-500 dark:text-red-400">Error: {(error as any)?.message || 'Failed to fetch caller IDs'}</div>;

  return (
    <div className="bg-[#F9FAFB] dark:bg-slate-900 min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">Caller ID</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto bg-[#FECD56] text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#F0D500] transition-colors text-sm shadow-sm"
          >
            <FiPlus size={18} /> Add CallScout Number
          </button>
        </header>

        {/* Search & Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by phone number"
              className="w-full pl-11 pr-4 py-2.5 bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm dark:text-white dark:placeholder-gray-500"
            />
          </div>
          <button className="text-sm font-bold text-gray-600 dark:text-gray-400 flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-slate-800 transition-colors">
            <BiSortAlt2 size={18} /> Sort by
          </button>
        </div>

        {/* Table */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 dark:bg-slate-900/50 border-b border-gray-100 dark:border-slate-700">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Number & Label</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Twilio SID</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Available To</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Added On</th>
                  <th className="px-6 py-4 text-right" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50 dark:divide-slate-700">
                {callerIds?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500 dark:text-gray-400">
                      No Caller IDs found. Click "Add CallScout Number" to create one.
                    </td>
                  </tr>
                ) : (
                  callerIds?.map((number: any) => (
                    <tr key={number.id} className="hover:bg-gray-50/80 dark:hover:bg-slate-700/50 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-gray-900 dark:text-white">{number.twillioNumber || number.friendlyName || number.callerId}</span>
                          <span className="text-[11px] font-medium text-gray-500 dark:text-gray-400 mt-0.5">{number.label || 'Unnamed Number'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[11px] font-mono text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-slate-900 px-2 py-1 rounded">
                          {number.twillioSid || 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-semibold text-gray-700 dark:text-gray-300">{number.countryCode || 'US'}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1">
                          {number.availableTo?.length > 0 ? (
                            number.availableTo.map((team: string) => (
                              <span key={team} className="text-[9px] font-extrabold bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 px-2 py-0.5 rounded-md border border-blue-100 dark:border-blue-800 uppercase">
                                {team}
                              </span>
                            ))
                          ) : (
                            <span className="text-[9px] font-extrabold bg-gray-50 dark:bg-slate-900 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-md border border-gray-100 dark:border-slate-800 uppercase">ALL</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full ${number.status === 'Healthy' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-100 dark:border-green-800' : 'bg-gray-900 dark:bg-slate-200 text-white dark:text-slate-900'}`}>
                          {number.status === 'Healthy' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                          {number.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[13px] font-medium text-gray-500 dark:text-gray-400">
                        {new Date(number.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-right whitespace-nowrap">
                        <RowMenu
                          onSettings={() => handleOpenSettings(number)}
                          onDelete={() => handleDelete(number)}
                        />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modals */}
        <AddCallScoutNumberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddNumberSuccess}
        />

        <NumberSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => {
            setIsSettingsModalOpen(false);
            setSelectedCallerId(null);
          }}
          createdCallerId={selectedCallerId}
        />
      </div>
    </div>
  );
};

export default CallerId;
