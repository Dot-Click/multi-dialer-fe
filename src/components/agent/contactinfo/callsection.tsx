import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { Briefcase } from 'lucide-react';
import { useTwilio } from "@/providers/twilio.provider";

// Define the statuses to match the design (mapped from contact data if possible)
type CallStatus = "Connected" | "On Hold" | "Hung Up" | "Queued" | "Ringing" | "Disconnected";

const getStatusBadgeStyle = (status: CallStatus) => {
  switch (status) {
    case 'Connected': 
      return 'bg-[#E8FFF3] text-[#10B981]'; // Light Green / Dark Green text
    case 'Ringing':
      return 'bg-blue-50 text-blue-500 animate-pulse';
    case 'On Hold': 
      return 'bg-[#FEFCE8] text-[#CA8A04]'; // Light Yellow / Dark Yellow text
    case 'Hung Up': 
    case 'Disconnected':
      return 'bg-[#FEE2E2] text-[#EF4444]'; // Light Red / Dark Red text
    default: 
      return 'bg-gray-100 text-gray-600';
  }
};

const CallSection = () => {
  const { queue, currentContact } = useAppSelector((state) => state.contacts);
  const { callStatus, resetCallStatus } = useTwilio();

  // Reset status when contact changes
  useEffect(() => {
    resetCallStatus();
  }, [currentContact?.id, resetCallStatus]);

  // Map internal Twilio status to UI status
  const getUiStatus = (isActive: boolean): CallStatus => {
    if (!isActive) return "Queued";
    
    switch (callStatus) {
      case 'idle': return "Queued";
      case 'ringing': return "Ringing";
      case 'connected': return "Connected";
      case 'on-hold': return "On Hold";
      case 'disconnected': return "Disconnected";
      default: return "Queued";
    }
  };

  // If no queue, show message
  if (queue.length === 0) {
    return <div className="p-8 text-center text-gray-500">No contacts in queue</div>;
  }

  return (
    <div className="w-full font-inter">
      {/* Horizontal Scroll Container */}
      <div className="flex space-x-4 py-4 px-2 overflow-x-auto no-scrollbar scroll-smooth">
        {queue.map((call, index) => {
          const isActive = currentContact?.id === call.id;
          const status = getUiStatus(isActive);

          return (
            <div
              key={call.id || index}
              className={`min-w-[240px] md:min-w-[260px] h-[190px] 
                         bg-white rounded-2xl border ${isActive ? 'border-[#FFCA06] shadow-md' : 'border-[#F1F3F9] shadow-sm'}
                         flex flex-col items-center justify-between p-6
                         transition-all duration-200`}
            >
              {/* Top Section: Name and Info */}
              <div className="text-center space-y-2">
                <h3 className="text-[19px] font-semibold text-[#374151]">
                  {call.fullName || call.name}
                </h3>
                
                <div className="flex items-center justify-center gap-2 text-[#6B7280]">
                  <Briefcase size={18} strokeWidth={1.5} className="text-gray-500" />
                  <span className="text-[17px] font-medium tracking-tight">
                    {call.phones?.[0]?.number || call.phone || "No phone"}
                  </span>
                </div>
              </div>

              {/* Bottom Section: Status Badge */}
              <div className={`w-full py-2 rounded-full text-center text-[14px] font-semibold tracking-wide ${getStatusBadgeStyle(status)}`}>
                {status}
              </div>
            </div>
          );
        })}
      </div>

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