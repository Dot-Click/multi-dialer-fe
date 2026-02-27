import React, { useState } from 'react';
import { FiPlus, FiSearch, FiMoreHorizontal } from 'react-icons/fi';
import { BiSortAlt2 } from 'react-icons/bi';
import AddCallScoutNumberModal from './AddCallScoutNumberModal';
import NumberSettingsModal from './NumberSettingsModal';
import { useCallerIds } from '@/hooks/useSystemSettings';

const CallerId: React.FC = () => {
  const { data: callerIds, isLoading, isError, error } = useCallerIds();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);
  const [newCallerId, setNewCallerId] = useState<any>(null);

  const handleAddNumberSuccess = (callerId: any) => {
    setIsAddModalOpen(false);
    setNewCallerId(callerId);
    setIsSettingsModalOpen(true);
  };

  if (isLoading) return <div className="p-8 text-center text-gray-500">Loading Caller IDs...</div>;
  if (isError) return <div className="p-8 text-center text-red-500">Error: {(error as any)?.message || 'Failed to fetch caller IDs'}</div>;

  return (
    <div className="bg-[#F9FAFB] min-h-screen px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
          <h1 className="text-3xl font-extrabold text-gray-900">Caller ID</h1>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="w-full sm:w-auto bg-[#FECD56] text-black font-bold py-3 px-6 rounded-xl flex items-center justify-center gap-2 hover:bg-[#F0D500] transition-colors text-sm shadow-sm"
          >
            <FiPlus size={18} /> Add CallScout Number
          </button>
        </header>

        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Search by phone number" className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm" />
          </div>
          <button className="text-sm font-bold text-gray-600 flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <BiSortAlt2 size={18} /> Sort by
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50/50 border-b border-gray-100">
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Number & Label</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Twilio SID</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Country</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Available To</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-[10px] font-extrabold text-gray-400 uppercase tracking-wider">Added On</th>
                  <th className="px-6 py-4 text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {callerIds?.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-12 text-center text-gray-500">
                      No Caller IDs found. Click "Add CallScout Number" to create one.
                    </td>
                  </tr>
                ) : (
                  callerIds?.map((number: any) => (
                    <tr key={number.id} className="hover:bg-gray-50/80 transition-colors group">
                      <td className="px-6 py-5">
                        <div className="flex flex-col">
                          <span className="text-[14px] font-bold text-gray-900">{number.friendlyName || number.callerId}</span>
                          <span className="text-[11px] font-medium text-gray-500 mt-0.5">{number.label || 'Unnamed Number'}</span>
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[11px] font-mono text-gray-400 bg-gray-100 px-2 py-1 rounded">
                          {number.twillioSid ? `${number.twillioSid}` : 'N/A'}
                        </span>
                      </td>
                      <td className="px-6 py-5">
                        <span className="text-[13px] font-semibold text-gray-700">{number.countryCode || 'US'}</span>
                      </td>
                      <td className="px-6 py-5">
                        <div className="flex flex-wrap gap-1">
                          {number.availableTo?.length > 0 ? (
                            number.availableTo.map((team: string) => (
                              <span key={team} className="text-[9px] font-extrabold bg-blue-50 text-blue-600 px-2 py-0.5 rounded-md border border-blue-100 uppercase">
                                {team}
                              </span>
                            ))
                          ) : (
                            <span className="text-[9px] font-extrabold bg-gray-50 text-gray-500 px-2 py-0.5 rounded-md border border-gray-100 uppercase">ALL</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold rounded-full ${number.status === 'Healthy' ? 'bg-green-50 text-green-700 border border-green-100' : 'bg-gray-900 text-white'}`}>
                          {number.status === 'Healthy' && <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />}
                          {number.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-6 py-5 text-[13px] font-medium text-gray-500">
                        {new Date(number.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-5 text-right whitespace-nowrap">
                        <button className="text-gray-400 p-2 rounded-lg hover:bg-gray-100 hover:text-gray-600 transition-all opacity-0 group-hover:opacity-100">
                          <FiMoreHorizontal size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        <AddCallScoutNumberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddNumberSuccess}
        />

        <NumberSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
          createdCallerId={newCallerId}
        />
      </div>
    </div>
  );
};

export default CallerId;
