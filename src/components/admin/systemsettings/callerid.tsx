import React, { useState } from 'react';
import { FiPlus, FiSearch, FiMoreHorizontal } from 'react-icons/fi';
import { BiSortAlt2 } from 'react-icons/bi';
import AddCallScoutNumberModal from './AddCallScoutNumberModal';
import NumberSettingsModal from './NumberSettingsModal';
import { useCallerIds } from '@/hooks/useSystemSettings';

const NumberCard: React.FC<{ data: any }> = ({ data }) => (
  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition hover:shadow-md">
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center text-sm">
      <div className="col-span-1">
        <div className="flex items-center gap-2 mb-1">
          <h3 className="font-semibold text-gray-800">{data.label || 'Unnamed'}</h3>
          <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${data.status === 'Healthy' ? 'bg-green-100 text-green-700' : 'bg-black text-white'}`}>{data.status || 'Active'}</span>
        </div>
        <p className="text-gray-500 text-xs">{data.callerId || 'No ID'}</p>
      </div>
      <div className="col-span-1"><p className="text-gray-500 text-xs mb-1">Country</p><p className="font-medium">{data.countryCode || 'N/A'}</p></div>
      <div className="col-span-1"><p className="text-gray-500 text-xs mb-1">Available to</p><p className="font-medium">{data.availableTo?.join(', ') || 'All'}</p></div>
      <div className="col-span-1"><p className="text-gray-500 text-xs mb-1">Added on</p><p className="font-medium">{new Date(data.createdAt).toLocaleDateString()}</p></div>
      <div className="col-span-1 flex justify-end"><button className="text-gray-500 p-2 rounded-full hover:bg-gray-100"><FiMoreHorizontal size={20} /></button></div>
    </div>
  </div>
);

const CallerId: React.FC = () => {
  const { data: callerIds, isLoading, isError, error } = useCallerIds();
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  const handleAddNumberSuccess = () => {
    setIsAddModalOpen(false);
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

        <div className="space-y-4">
          {callerIds?.length === 0 ? (
            <div className="text-center py-10 bg-white rounded-xl border border-dashed border-gray-300">
              <p className="text-gray-500">No Caller IDs found. Click "Add CallScout Number" to create one.</p>
            </div>
          ) : (
            callerIds?.map((number: any) => <NumberCard key={number.id} data={number} />)
          )}
        </div>

        <AddCallScoutNumberModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSuccess={handleAddNumberSuccess}
        />

        <NumberSettingsModal
          isOpen={isSettingsModalOpen}
          onClose={() => setIsSettingsModalOpen(false)}
        />
      </div>
    </div>
  );
};

export default CallerId;
