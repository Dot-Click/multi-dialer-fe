import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { Briefcase, Mic, MicOff, Pause, Play } from 'lucide-react';
import { useTwilio } from "@/providers/twilio.provider";
import { useLocation } from "react-router-dom";

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
  const location = useLocation();
  
  // Extract custom hold recording URL passed from the settings modal
  const holdRecordingUrl = location.state?.holdRecordingUrl;

  const { 
    callStatus, 
    resetCallStatus, 
    toggleHold, 
    isHold, 
    toggleMute, 
    isMuted 
  } = useTwilio();

  // Reset status when contact changes
  useEffect(() => {
    resetCallStatus();
  }, [currentContact?.id, resetCallStatus]);

  // Map internal Twilio status to UI status
  const getUiStatus = (isActive: boolean): CallStatus => {
    if (!isActive) return "Queued";
    
    // Explicitly check isHold state first
    if (isHold) return "On Hold";

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
          const showControls = isActive && (status === "Connected" || status === "On Hold");

          return (
             <div
               key={call.id || index}
               className={`min-w-60 md:min-w-[260px] min-h-[190px] 
                          bg-white dark:bg-slate-800 rounded-2xl border ${isActive ? 'border-[#FFCA06] shadow-md' : 'border-[#F1F3F9] dark:border-slate-700 shadow-sm'}
                          flex flex-col items-center justify-between p-6
                          transition-all duration-200`}
             >
              {/* Top Section: Name and Info */}
              <div className="text-center space-y-2 w-full">
                <h3 className="text-[19px] font-semibold text-[#374151] dark:text-white truncate">
                  {call.fullName || call.name}
                </h3>
                
                <div className="flex items-center justify-center gap-2 text-[#6B7280] dark:text-gray-400">
                  <Briefcase size={18} strokeWidth={1.5} className="text-gray-500 dark:text-gray-400 shrink-0" />
                  <span className="text-[17px] font-medium tracking-tight truncate">
                    {call.phones?.[0]?.number || call.phone || "No phone"}
                  </span>
                </div>
              </div>

              {/* Bottom Section: Controls & Status */}
              <div className="w-full space-y-3 mt-4">
                
                {/* Active Call Controls (Only shows when connected/on-hold) */}
                {showControls && (
                  <div className="flex items-center gap-2 w-full">
                    <button
                      onClick={toggleMute}
                      title={isMuted ? "Unmute" : "Mute"}
                      className={`flex-1 flex justify-center items-center py-2.5 rounded-xl transition-all ${
                        isMuted 
                          ? 'bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200'
                      }`}
                    >
                      {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                    </button>
                    
                    <button
                      onClick={() => toggleHold(holdRecordingUrl)}
                      title={isHold ? "Resume Call" : "Put on Hold"}
                      className={`flex-1 flex justify-center items-center py-2.5 rounded-xl transition-all ${
                        isHold 
                          ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200 dark:bg-yellow-900/30 dark:text-yellow-500' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-slate-700 dark:text-gray-200'
                      }`}
                    >
                      {isHold ? <Play size={18} /> : <Pause size={18} />}
                    </button>
                  </div>
                )}

                {/* Status Badge */}
                <div className={`w-full py-2 rounded-full text-center text-[14px] font-semibold tracking-wide ${getStatusBadgeStyle(status)}`}>
                  {status}
                </div>
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
        .dark .no-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
        }
      `}} />
    </div>
  );
};

export default CallSection;