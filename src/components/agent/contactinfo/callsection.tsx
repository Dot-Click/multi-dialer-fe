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
    endCall
  } = useTwilio();

  // Reset status when contact changes
  useEffect(() => {
    resetCallStatus();
  }, [currentContact?.id, resetCallStatus]);

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
                className="min-w-64 md:min-w-[280px] min-h-[220px] bg-[#111111] rounded-[24px] flex flex-col items-center justify-between p-6 shadow-2xl border border-white/5"
              >
                <div className="text-center w-full mt-1">
                  <h3 className="text-[20px] font-bold text-white leading-tight uppercase tracking-tight">
                    {call.fullName || call.name}
                  </h3>
                  <p className="text-[14px] font-medium text-gray-400 mt-0.5">
                    ({call.phones?.[0]?.number?.slice(0, 3) || "252"}) {call.phones?.[0]?.number?.slice(3) || "555-0126"}
                  </p>
                </div>

                <div className="bg-[#2D2D2D] px-6 py-1.5 rounded-full">
                  <span className="text-[15px] font-bold text-gray-300 tracking-wider">
                    {formatDuration(duration)}
                  </span>
                </div>

                <div className="flex items-center gap-2 w-full justify-center mb-1">
                  <button
                    onClick={toggleMute}
                    title={isMuted ? "Unmute" : "Mute"}
                    className={`w-12 h-12 flex justify-center items-center rounded-[14px] transition-all ${isMuted ? 'bg-[#CF3335] text-white shadow-lg shadow-red-900/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {isMuted ? <MicOff size={20} /> : <Mic size={20} />}
                  </button>

                  <button
                    onClick={() => toggleHold(holdRecordingUrl)}
                    title={isHold ? "Resume Call" : "Hold"}
                    className={`w-12 h-12 flex justify-center items-center rounded-[14px] transition-all ${isHold ? 'bg-[#EAB308] text-white shadow-lg shadow-yellow-900/20' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {isHold ? <Play size={20} /> : <Pause size={20} />}
                  </button>

                  {/* Voicemail Drop Button (The Arrow) */}
                  <button
                    onClick={dropVoicemail}
                    disabled={isDroppingingVoicemail || !answeringMachineUrl}
                    title="Drop Voicemail & Next"
                    className="w-12 h-12 flex justify-center items-center rounded-[14px] bg-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-20 disabled:cursor-not-allowed"
                  >
                    {isDroppingingVoicemail 
                      ? <Loader2 size={20} className="animate-spin text-gray-400" />
                      : <ArrowRightLeft size={20} />
                    }
                  </button>

                  {/* Hang Up Button */}
                  <button
                    onClick={endCall}
                    title="Hang Up"
                    className="w-12 h-12 flex justify-center items-center rounded-[14px] bg-[#CF3335] hover:bg-[#b8292b] text-white shadow-lg shadow-red-900/40 active:scale-95 transition-all"
                  >
                    <PhoneOff size={20} />
                  </button>
                </div>
              </div>
            );
          }

          // ORIGINAL STYLE FOR OTHERS
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
                {/* Status Badge */}
                <div className={`w-full py-2 rounded-full text-center text-[14px] font-semibold tracking-wide ${getStatusBadgeStyle(status)}`}>
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