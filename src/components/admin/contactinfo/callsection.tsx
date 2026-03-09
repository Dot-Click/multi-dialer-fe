
import callsectionicon from "../../../assets/callsectionicon.png"



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
  { id: 2, name: 'John Doe', phone: '(252) 555-0126', status: 'queued' },
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
      <div className="flex space-x-5 custom-scrollbar py-3 px-4 overflow-x-auto ">

        {callData.map((call) => {

          const isActive = call.status === "active";

          return (
            <div
              key={call.id}
              className={`
                min-w-[250px] max-w-[250px] h-[200px] 
                rounded-[12px] p-[16px] border-[1.5px] border-[#EBEDF0] shadow-sm
                transition-all duration-300 flex flex-col text-center
justify-center bg-white text-gray-800 items-center
                
              `}
            >

              {/* Name + Phone (Always centered except active) */}
              <div className={`flex flex-col items-center gap-1 ${isActive ? '' : 'mb-3'}`}>
                <h3 className="font-[500]  text-[#495057] text-[20px]">{call.name}</h3>
                <div className={`flex items-center gap-2 text-sm ${isActive ? 'text-gray-100' : 'text-gray-500'}`}>
                    <img src={callsectionicon} alt="callsectionicon" className="w-4 object-contain  " />
                  <span className={`font-[500]  text-[#495057] text-[18px]`}>{call.phone}</span>
                </div>
              </div>

              {/* ✅ Active Controls vs Status Badge */}
              {isActive ? (
               <></>
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