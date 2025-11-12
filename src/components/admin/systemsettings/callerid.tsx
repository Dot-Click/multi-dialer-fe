// Icons from react-icons library
import { FiPlus, FiSearch, FiMoreHorizontal } from 'react-icons/fi';
import { BiSortAlt2 } from 'react-icons/bi';
import React from 'react';

// ✅ Interface for NumberCard props
interface NumberData {
  id: number;
  name: string;
  callScoutId: string;
  status: string;
  country: string;
  availableTo: string;
  addedOn: string;
}

// ✅ Component Props Interface
interface NumberCardProps {
  data: NumberData;
}

// Data for the list of numbers
const numbersData: NumberData[] = [
  {
    id: 1,
    name: 'Number 1',
    callScoutId: 'CallScout ID',
    status: 'Healthy',
    country: 'United States/Canada',
    availableTo: 'All',
    addedOn: '09/09/2025',
  },
  {
    id: 2,
    name: 'Number 2',
    callScoutId: 'CallScout ID',
    status: 'Healthy',
    country: 'United States/Canada',
    availableTo: 'All',
    addedOn: '09/09/2025',
  },
  {
    id: 3,
    name: 'Number 3',
    callScoutId: 'CallScout ID',
    status: 'Unhealthy',
    country: 'United States/Canada',
    availableTo: 'All',
    addedOn: '09/09/2025',
  },
  {
    id: 4,
    name: 'Number 4',
    callScoutId: 'CallScout ID',
    status: 'Healthy',
    country: 'United States/Canada',
    availableTo: 'All',
    addedOn: '09/09/2025',
  },
];

// ✅ Reusable component for each number card
const NumberCard: React.FC<NumberCardProps> = ({ data }) => {
  const isHealthy = data.status === 'Healthy';

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 transition hover:shadow-md">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-4 items-center text-sm">
        
        {/* Number and Status */}
        <div className="col-span-1 sm:col-span-2 md:col-span-1">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-800">{data.name}</h3>
            <span
              className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                isHealthy ? 'bg-green-100 text-green-700' : 'bg-black text-white'
              }`}
            >
              {data.status}
            </span>
          </div>
          <p className="text-gray-500 text-xs">{data.callScoutId}</p>
        </div>

        {/* Country */}
        <div className="col-span-1">
          <p className="text-gray-500 text-xs mb-1">Country</p>
          <p className="font-medium text-gray-800">{data.country}</p>
        </div>

        {/* Available to */}
        <div className="col-span-1">
          <p className="text-gray-500 text-xs mb-1">Available to</p>
          <p className="font-medium text-gray-800">{data.availableTo}</p>
        </div>

        {/* Added on */}
        <div className="col-span-1">
          <p className="text-gray-500 text-xs mb-1">Added on</p>
          <p className="font-medium text-gray-800">{data.addedOn}</p>
        </div>
        
        {/* Actions */}
        <div className="col-span-1 flex justify-end">
          <button className="text-gray-500 p-2 rounded-full hover:bg-gray-100">
            <FiMoreHorizontal size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

// ✅ Main Component
const CallerId: React.FC = () => {
  return (
    <div className="bg-white rounded-lg min-h-screen px-4 py-5">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-gray-900">Caller ID</h1>
          <button className="w-full sm:w-auto bg-yellow-400 text-black font-semibold py-2.5 px-5 rounded-lg flex items-center justify-center gap-2 hover:bg-yellow-500 transition-colors text-sm">
            <FiPlus size={18} />
            Add CallScout Number
          </button>
        </header>

        {/* Controls */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="relative w-full sm:w-auto sm:flex-grow max-w-sm">
            <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by phone number"
              className="w-full pl-11 pr-4 py-2.5 bg-white border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-yellow-400 text-sm"
            />
          </div>
          <button className="text-sm font-medium text-gray-600 flex items-center gap-2 p-2 rounded-lg hover:bg-gray-100">
            <BiSortAlt2 size={18} className="text-gray-500" />
            Sort by
          </button>
        </div>
        
        {/* List of Numbers */}
        <div className="space-y-4">
          {numbersData.map((number) => (
            <NumberCard key={number.id} data={number} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default CallerId;
