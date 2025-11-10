import {  FaPhoneAlt } from 'react-icons/fa';
import calliconcontactinfo from "../../../assets/calliconcontactinfo.png"
import contactinfothirdicon from "../../../assets/contactinfothirdicon.png"
import callsectionicon from "../../../assets/callsectionicon.png"
import { BsMicMute } from "react-icons/bs";


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
      <div className="flex space-x-4 custom-scrollbar overflow-x-auto pb-2">

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
                  ? 'justify-between bg-gray-950 text-white items-center'
                  : 'justify-center bg-white text-gray-800 items-center'}
              `}
            >

              {/* Name + Phone (Always centered except active) */}
              <div className={`flex flex-col items-center gap-1 ${isActive ? '' : 'mb-3'}`}>
                <h3 className="font-medium text-lg">{call.name}</h3>
                <div className={`flex items-center gap-2 text-sm ${isActive ? 'text-gray-100' : 'text-gray-500'}`}>
                    <img src={callsectionicon} alt="callsectionicon" className="w-4 object-contain  " />
                  <span className={`text-[16px] ${isActive ? 'text-gray-100' : "text-gray-950"}`}>{call.phone}</span>
                </div>
              </div>

              {/* ✅ Active Controls vs Status Badge */}
              {isActive ? (
                <div className="w-full flex flex-col items-center gap-3">
                  <div className="w-full text-center bg-gray-700/50 rounded-full py-1 text-sm">00:01</div>

                  <div className="flex justify-around w-full mt-2">
                    <button className="h-10 w-10 flex items-center text-gray-950 justify-center bg-gray-200 rounded-md px-3 py-1"><BsMicMute size={16} /></button>
                    <button className="h-10 w-10 flex items-center text-gray-950 justify-center bg-gray-200 rounded-md px-3 py-1"><FaPhoneAlt size={16} /></button>
                    <img src={contactinfothirdicon} alt="contactinfothirdicon" className="w-10 object-contain bg-gray-200 rounded-md px-3 py-1" />
                    <img src={calliconcontactinfo} alt="calliconcontactinfo" className="w-10 object-contain bg-red-600 rounded-md px-3 py-1" />
                  </div>
                </div>
              ) : (
                <div className={`mt-1 px-5 py-1 rounded-full font-normal w-full text-sm ${getStatusBadgeStyle(call.status)}`}>
                  {call.status.charAt(0).toUpperCase() + call.status.slice(1)}{call.status === 'calling' && '...'}
                </div>
              )}

            </div>
          );
        })}

      </div>
    </div>
  );
};

export default CallSection;
