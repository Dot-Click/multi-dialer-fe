import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { Briefcase, Loader2, Mic, MicOff, Pause, Play, PhoneOff, ArrowRightLeft } from 'lucide-react';
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
    isMuted,
    dropVoicemail, 
    isDroppingingVoicemail, 
    answeringMachineUrl,
    duration,
    endCall,
    isCalling
  } = useTwilio();

  // Reset status when contact changes - but only if not currently in a call
  useEffect(() => {
    if (!isCalling) {
      resetCallStatus();
    }
  }, [currentContact?.id, resetCallStatus, isCalling]);

  // Format duration (MM:SS)
  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Map internal Twilio status to UI status
  const getUiStatus = (isActive: boolean): CallStatus => {
    if (!isActive) return "Queued";
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
          const showControls = isActive && (status === "Connected" || status === "On Hold" || status === "Ringing");

          // NEW MOJO ACTIVE STYLE
          if (isActive && showControls) {
            return (
              <div
                key={call.id || index}
                className="min-w-72 md:min-w-[320px] min-h-[280px] bg-[#000000] rounded-[28px] flex flex-col items-center justify-between p-7 shadow-2xl border border-white/5"
              >
                <div className="text-center w-full mt-1">
                  <h3 className="text-[22px] font-bold text-white leading-tight">
                    {call.fullName || call.name}
                  </h3>
                  <div className="flex items-center justify-center gap-2 mt-1.5">
                    <Briefcase size={18} className="text-gray-400" />
                    <p className="text-[17px] font-medium text-gray-300">
                      {call.phones?.[0]?.number || call.phone || "(252) 555-0126"}
                    </p>
                  </div>
                  {/* Status Label */}
                  <div className="mt-2.5">
                    <span className={`text-[12px] font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full ${status === 'Ringing' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-green-400/10 text-green-400'}`}>
                      {status}
                    </span>
                  </div>
                </div>

                <div className="bg-[#2D2D2D] px-10 py-2.5 rounded-full mx-auto w-fit min-w-[140px] flex justify-center">
                  <span className={`text-[18px] font-bold text-white tracking-wider ${status === 'Ringing' ? 'animate-pulse text-yellow-400' : ''}`}>
                    {status === 'Ringing' ? 'Ringing...' : formatDuration(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-3 w-full justify-center mb-1">
                  <button
                    onClick={toggleMute}
                    title={isMuted ? "Unmute" : "Mute"}
                    className={`w-14 h-14 flex justify-center items-center rounded-2xl transition-all ${isMuted ? 'bg-[#EF4444] text-white' : 'bg-[#E5E7EB] text-[#1F2937] hover:bg-white'}`}
                  >
                    {isMuted ? <MicOff size={22} /> : <Mic size={22} />}
                  </button>

                  <button
                    onClick={() => toggleHold(holdRecordingUrl)}
                    title={isHold ? "Resume Call" : "Hold"}
                    className={`w-14 h-14 flex justify-center items-center rounded-2xl transition-all ${isHold ? 'bg-[#EAB308] text-white' : 'bg-[#E5E7EB] text-[#1F2937] hover:bg-white'}`}
                  >
                    {isHold ? <Play size={22} /> : <Pause size={22} />}
                  </button>

                  {/* Voicemail Drop Button (The Arrow) */}
                  <button
                    onClick={dropVoicemail}
                    disabled={isDroppingingVoicemail || !answeringMachineUrl}
                    title="Drop Voicemail & Next"
                    className="w-14 h-14 flex justify-center items-center rounded-2xl bg-[#E5E7EB] text-[#1F2937] hover:bg-white transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    {isDroppingingVoicemail 
                      ? <Loader2 size={22} className="animate-spin text-gray-400" />
                      : <ArrowRightLeft size={22} />
                    }
                  </button>

                  {/* Hang Up Button */}
                  <button
                    onClick={endCall}
                    title="Hang Up"
                    className="w-14 h-14 flex justify-center items-center rounded-2xl bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-lg active:scale-95 transition-all"
                  >
                    <PhoneOff size={22} />
                  </button>
                </div>
              </div>
            );
          }

          // ORIGINAL STYLE FOR OTHERS
          return (
            <div
              key={call.id || index}
              className={`min-w-72 md:min-w-[320px] min-h-[280px] 
                          bg-white dark:bg-slate-800 rounded-[28px] border ${isActive ? 'border-[#FFCA06] shadow-md' : 'border-gray-100 dark:border-slate-700 shadow-sm'}
                          flex flex-col items-center justify-between p-7
                          transition-all duration-200`}
            >
              {/* Top Section: Name and Info */}
              <div className="text-center space-y-2 w-full mt-2">
                <h3 className="text-[22px] font-bold text-[#374151] dark:text-white truncate">
                  {call.fullName || call.name}
                </h3>

                <div className="flex items-center justify-center gap-2 text-[#6B7280] dark:text-gray-400">
                  <Briefcase size={18} strokeWidth={1.5} className="text-gray-500 dark:text-gray-400 shrink-0" />
                  <span className="text-[17px] font-medium tracking-tight truncate">
                    {call.phones?.[0]?.number || call.phone || "No phone"}
                  </span>
                </div>
              </div>

              {/* Bottom Section: Status */}
              <div className="w-full mt-auto mb-2">
                <div className={`w-full py-3 rounded-full text-center text-[16px] font-bold tracking-wide ${getStatusBadgeStyle(status)}`}>
                  {status}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      <style dangerouslySetInnerHTML={{
        __html: `
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