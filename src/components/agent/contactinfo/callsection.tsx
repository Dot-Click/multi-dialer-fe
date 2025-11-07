import React from 'react';
import { FaBriefcase, FaMicrophoneSlash, FaPhoneAlt, FaPhoneSlash } from 'react-icons/fa';
import { IoSwapHorizontal } from 'react-icons/io5';

// ✅ Type define kiya
type CallStatus = "disconnected" | "active" | "calling" | "next" | "queued";

interface CallItem {
  id: number;
  name: string;
  phone: string;
  status: CallStatus;
}

// ✅ Same data (no styling change)
const callData: CallItem[] = [
  { id: 1, name: 'John Doe', phone: '(252) 555-0126', status: 'disconnected' },
  { id: 2, name: 'John Doe', phone: '(252) 555-0126', status: 'active' },
  { id: 3, name: 'John Doe', phone: '(252) 555-0126', status: 'calling' },
  { id: 4, name: 'John Doe', phone: '(252) 555-0126', status: 'next' },
  { id: 5, name: 'Jane Smith', phone: '(303) 555-0133', status: 'queued' },
];

// ✅ Type add kiya (error fix hogaya)
const getStatusBadgeStyle = (status: CallStatus) => {
  switch (status) {
    case 'disconnected': return 'bg-red-100 text-red-600';
    case 'calling': return 'bg-orange-100 text-orange-600';
    case 'next': return 'bg-blue-100 text-blue-600';
    default: return 'bg-gray-100 text-gray-600';
  }
};

const CallSection = () => {
  return (
    <div className="w-full">
      <div className="flex space-x-4 custom-scrollbar overflow-x-auto pb-4">

        {callData.map((call) => {

          const isActive = call.status === "active";

          return (
            <div
              key={call.id}
              className={`
                min-w-[220px] max-w-[220px] h-[230px] 
                rounded-2xl p-5 shadow-sm
                transition-all duration-300 flex flex-col text-center

                ${isActive 
                  ? 'justify-between bg-gray-900 text-white items-center' 
                  : 'justify-center bg-white text-gray-800 items-center'}
              `}
            >

              {/* Name + Phone (Always centered except active) */}
              <div className={`flex flex-col items-center gap-1 ${isActive ? '' : 'mb-3'}`}>
                <h3 className="font-bold text-lg">{call.name}</h3>
                <div className={`flex items-center gap-1 text-sm ${isActive ? 'text-gray-400' : 'text-gray-500'}`}>
                  <FaBriefcase />
                  <span>{call.phone}</span>
                </div>
              </div>

              {/* ✅ Active Controls vs Status Badge */}
              {isActive ? (
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="w-full text-center bg-gray-700/50 rounded-full py-1 text-sm">00:01</div>

                  <div className="flex justify-around w-full mt-2">
                    <button className="h-10 w-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"><FaMicrophoneSlash size={16} /></button>
                    <button className="h-10 w-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"><FaPhoneAlt size={16} /></button>
                    <button className="h-10 w-10 flex items-center justify-center bg-gray-700 rounded-full hover:bg-gray-600"><IoSwapHorizontal size={18} /></button>
                    <button className="h-10 w-10 flex items-center justify-center bg-red-600 rounded-full hover:bg-red-500"><FaPhoneSlash size={16} /></button>
                  </div>
                </div>
              ) : (
                <div className={`mt-1 px-5 py-2 rounded-full font-semibold text-sm ${getStatusBadgeStyle(call.status)}`}>
                  {call.status.charAt(0).toUpperCase() + call.status.slice(1)}{call.status === 'calling' && '...'}
                </div>
              )}

            </div>
          );
        })}

      </div>

      {/* Progress Bar (same) */}
      <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
        <div className="h-full bg-gray-400" style={{ width: '30%' }}></div>
      </div>

    </div>
  );
};

export default CallSection;
