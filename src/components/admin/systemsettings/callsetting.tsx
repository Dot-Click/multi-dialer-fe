import React, { useState } from 'react';
import { FiPlus, FiSearch, FiMoreHorizontal } from 'react-icons/fi';
import { BiSortAlt2 } from 'react-icons/bi';
import { Link } from 'react-router-dom';

// ✅ Interfaces for type safety
interface NumberData {
  id: number;
  name: string;
  callScoutId: string;
  status: string;
  country: string;
  addedOn: string;
  autoPause: boolean;
}

interface ToggleSwitchProps {
  enabled: boolean;
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>;
}

interface NumberCardProps {
  data: NumberData;
}

// ✅ Dummy Data
const numbersData: NumberData[] = [
  { id: 1, name: 'Number 1', callScoutId: 'CallScout ID', status: 'Healthy', country: 'United States/Canada', addedOn: '09/09/2025', autoPause: true },
  { id: 2, name: 'Number 2', callScoutId: 'CallScout ID', status: 'Healthy', country: 'United States/Canada', addedOn: '09/09/2025', autoPause: false },
  { id: 3, name: 'Number 3', callScoutId: 'CallScout ID', status: 'Unhealthy', country: 'United States/Canada', addedOn: '09/09/2025', autoPause: true },
  { id: 4, name: 'Number 4', callScoutId: 'CallScout ID', status: 'Healthy', country: 'United States/Canada', addedOn: '09/09/2025', autoPause: false },
];

// ✅ Toggle Switch Component
const ToggleSwitch: React.FC<ToggleSwitchProps> = ({ enabled, setEnabled }) => (
  <button
    onClick={() => setEnabled(!enabled)}
    className={`relative inline-flex h-6 w-11 rounded-full transition-all duration-200 ${
      enabled ? 'bg-gray-800' : 'bg-gray-300'
    }`}
  >
    <span
      className={`inline-block h-5 w-5 bg-white rounded-full shadow transform transition duration-200 ${
        enabled ? 'translate-x-5' : 'translate-x-0'
      }`}
    />
  </button>
);

// ✅ Card Component
const NumberCard: React.FC<NumberCardProps> = ({ data }) => {
  const [isAutoPause, setIsAutoPause] = useState<boolean>(data.autoPause);
  const isHealthy = data.status === 'Healthy';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition hover:shadow-md">

      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-6 gap-6 items-center text-sm">
        
        {/* Number & Status */}
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800">{data.name}</h3>
            <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${isHealthy ? 'bg-green-100 text-green-700' : 'bg-black text-white'}`}>
              {data.status}
            </span>
          </div>
          <p className="text-gray-500 text-xs">{data.callScoutId}</p>
        </div>

        {/* Country */}
        <div>
          <p className="text-gray-500 text-xs mb-1">Country</p>
          <p className="font-medium text-gray-800">{data.country}</p>
        </div>

        {/* Added On */}
        <div>
          <p className="text-gray-500 text-xs mb-1">Added on</p>
          <p className="font-medium text-gray-800">{data.addedOn}</p>
        </div>

        {/* Auto Pause */}
        <div>
          <p className="text-gray-500 text-xs mb-1">Auto Pause</p>
          <ToggleSwitch enabled={isAutoPause} setEnabled={setIsAutoPause} />
        </div>

        {/* Menu */}
        <div className="col-span-2 flex justify-end">
          <button className="text-gray-500 p-2 hover:bg-gray-100 rounded-full">
            <FiMoreHorizontal size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="lg:hidden flex flex-col gap-4 text-sm">

        <div className="flex justify-between items-start">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-semibold text-gray-800">{data.name}</h3>
              <span className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${isHealthy ? 'bg-green-100 text-green-700' : 'bg-black text-white'}`}>
                {data.status}
              </span>
            </div>
            <p className="text-gray-500 text-xs">{data.callScoutId}</p>
          </div>
          <button className="text-gray-500 p-2 hover:bg-gray-100 rounded-full">
            <FiMoreHorizontal size={20} />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
          <div>
            <p className="text-gray-500 text-xs mb-1">Country</p>
            <p className="font-medium text-gray-800">{data.country}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Added on</p>
            <p className="font-medium text-gray-800">{data.addedOn}</p>
          </div>
          <div>
            <p className="text-gray-500 text-xs mb-1">Auto Pause</p>
            <ToggleSwitch enabled={isAutoPause} setEnabled={setIsAutoPause} />
          </div>
        </div>

      </div>

    </div>
  );
};

// ✅ Main Component
const CallSetting: React.FC = () => {

  return (
    <div className="bg-white min-h-screen px-4 py-5 rounded-lg">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Call Settings</h1>
            <Link 
              to="/admin/create-setting"
              className="w-full sm:w-auto bg-yellow-400 text-black font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 text-sm hover:bg-yellow-500 transition"
            >
              <FiPlus size={18} />
              Add Setting
            </Link>
        </header>

        {/* Search + Sort */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-auto sm:flex-grow max-w-sm">
            <input
              type="text"
              placeholder="Search by phone number"
              className="w-full pl-4 pr-11 py-2.5 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
            <FiSearch className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>

          <button className="text-sm font-medium text-gray-600 flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <BiSortAlt2 size={18} /> Sort by
          </button>
        </div>

        {/* List */}
        <div className="space-y-6">
          {numbersData.map((number) => (
            <NumberCard key={number.id} data={number} />
          ))}
        </div>

      </div>
    </div>
  );
};

export default CallSetting;
