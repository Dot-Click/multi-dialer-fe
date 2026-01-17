
// import callsectionicon from "../../../assets/callsectionicon.png"



// // ✅ Type define kiya
// type CallStatus = "disconnected" | "active" | "calling" | "next" | "queued";

// interface CallItem {
//   id: number;
//   name: string;
//   phone: string;
//   status: CallStatus;
// }

// // ✅ Same data (no styling change)
// const callData: CallItem[] = [
//   { id: 1, name: 'John Doe', phone: '(252) 555-0126', status: 'disconnected' },
//   { id: 2, name: 'John Doe', phone: '(252) 555-0126', status: 'queued' },
//   { id: 3, name: 'John Doe', phone: '(252) 555-0126', status: 'calling' },
//   { id: 4, name: 'John Doe', phone: '(252) 555-0126', status: 'next' },
//   { id: 5, name: 'Jane Smith', phone: '(303) 555-0133', status: 'queued' },
// ];

// // ✅ Type add kiya (error fix hogaya)
// const getStatusBadgeStyle = (status: CallStatus) => {
//   switch (status) {
//     case 'disconnected': return 'bg-red-100 text-red-600';
//     case 'calling': return 'bg-orange-100 text-orange-600';
//     case 'next': return 'bg-blue-100 text-blue-600';
//     default: return 'bg-gray-100 text-gray-600';
//   }
// };

// const CallSection = () => {
//   return (
//     <div className="w-full">
//       <div className="flex space-x-5 custom-scrollbar py-3 px-4 overflow-x-auto ">

//         {callData.map((call) => {

//           const isActive = call.status === "active";

//           return (
//             <div
//               key={call.id}
//               className={`
//                 min-w-[250px] max-w-[250px] h-[200px] 
//                 rounded-[12px] p-[16px] border-[1.5px] border-[#EBEDF0] shadow-sm
//                 transition-all duration-300 flex flex-col text-center
// justify-center bg-white text-gray-800 items-center
                
//               `}
//             >

//               {/* Name + Phone (Always centered except active) */}
//               <div className={`flex flex-col items-center gap-1 ${isActive ? '' : 'mb-3'}`}>
//                 <h3 className="font-[500]  text-[#495057] text-[20px]">{call.name}</h3>
//                 <div className={`flex items-center gap-2 text-sm ${isActive ? 'text-gray-100' : 'text-gray-500'}`}>
//                     <img src={callsectionicon} alt="callsectionicon" className="w-4 object-contain  " />
//                   <span className={`font-[500]  text-[#495057] text-[18px]`}>{call.phone}</span>
//                 </div>
//               </div>

//               {/* ✅ Active Controls vs Status Badge */}
//               {isActive ? (
//                <></>
//               ) : (
//                 <div className={`mt-1 px-5 py-1 rounded-full font-normal w-full text-sm ${getStatusBadgeStyle(call.status)}`}>
//                   {call.status.charAt(0).toUpperCase() + call.status.slice(1)}{call.status === 'calling' && '...'}
//                 </div>
//               )}

//             </div>
//           );
//         })}

//       </div>
//     </div>
//   );
// };

// export default CallSection;




import React from 'react';
import { Briefcase } from 'lucide-react';

// Define the statuses to match the design
type CallStatus = "Connected" | "On Hold" | "Hung Up";

interface CallItem {
  id: number;
  name: string;
  phone: string;
  status: CallStatus;
}

const callData: CallItem[] = [
  { id: 1, name: 'John Smith', phone: '(252) 555-0126', status: 'Connected' },
  { id: 2, name: 'Sarah Johnson', phone: '+1 (555) 234-5678', status: 'On Hold' },
  { id: 3, name: 'Mike Davis', phone: '+1 (555) 345-6789', status: 'Hung Up' },
  { id: 4, name: 'Emily Brown', phone: '(252) 555-0126', status: 'Connected' },
  { id: 5, name: 'Chris Wilson', phone: '(303) 555-9999', status: 'On Hold' },
];

const getStatusBadgeStyle = (status: CallStatus) => {
  switch (status) {
    case 'Connected': 
      return 'bg-[#E8FFF3] text-[#10B981]'; // Light Green / Dark Green text
    case 'On Hold': 
      return 'bg-[#FEFCE8] text-[#CA8A04]'; // Light Yellow / Dark Yellow text
    case 'Hung Up': 
      return 'bg-[#FEE2E2] text-[#EF4444]'; // Light Red / Dark Red text
    default: 
      return 'bg-gray-100 text-gray-600';
  }
};

const CallSection = () => {
  return (
    <div className="w-full font-inter">
      {/* Horizontal Scroll Container */}
      <div className="flex space-x-4 py-4 px-2 overflow-x-auto no-scrollbar scroll-smooth">
        {callData.map((call) => (
          <div
            key={call.id}
            className="min-w-[240px] md:min-w-[260px] h-[190px] 
                       bg-white rounded-2xl border border-[#F1F3F9] shadow-sm
                       flex flex-col items-center justify-between p-6
                       transition-all duration-200 hover:shadow-md"
          >
            {/* Top Section: Name and Info */}
            <div className="text-center space-y-2">
              <h3 className="text-[19px] font-semibold text-[#374151]">
                {call.name}
              </h3>
              
              <div className="flex items-center justify-center gap-2 text-[#6B7280]">
                {/* Briefcase icon as per design */}
                <Briefcase size={18} strokeWidth={1.5} className="text-gray-500" />
                <span className="text-[17px] font-medium tracking-tight">
                  {call.phone}
                </span>
              </div>
            </div>

            {/* Bottom Section: Status Badge */}
            <div className={`w-full py-2 rounded-full text-center text-[14px] font-semibold tracking-wide ${getStatusBadgeStyle(call.status)}`}>
              {call.status}
            </div>
          </div>
        ))}
      </div>

      {/* Optional: Add custom scrollbar styling if needed */}
      <style dangerouslySetInnerHTML={{ __html: `
        .no-scrollbar::-webkit-scrollbar {
          height: 6px;
        }
        .no-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .no-scrollbar::-webkit-scrollbar-thumb {
          background: #E5E7EB;
          border-radius: 10px;
        }
      `}} />
    </div>
  );
};

export default CallSection;