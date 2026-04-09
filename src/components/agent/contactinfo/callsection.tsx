import { useAppSelector } from "@/store/hooks";
import { useEffect } from "react";
import { Loader2, Mic, MicOff, Pause, Play, PhoneOff, ArrowRightLeft } from 'lucide-react';
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

interface CallSectionProps {
  contactStatuses?: Record<string, string>;
}

const CallSection = ({ contactStatuses = {} }: CallSectionProps) => {
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
    isCalling,
    activeBridgeContactId
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

  // Map internal Twilio status or session history to UI status for a specific card
  const getUiStatus = (callId: string, isBridgeActive: boolean): CallStatus => {
    // 1. If actually bridged right now
    if (isBridgeActive) {
      if (isHold) return "On Hold";
      switch (callStatus) {
        case 'ringing': return "Ringing";
        case 'connected': return "Connected";
        case 'on-hold': return "On Hold";
      }
    }

    // 2. Otherwise check session statuses from polling
    const s = contactStatuses[callId];
    if (s === 'ringing') return "Ringing";
    if (s === 'answered') return "Connected";
    if (s === 'failed') return "Disconnected";

    return "Queued";
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
          const isSelected = currentContact?.id === call.id;
          const isBridgeActive = activeBridgeContactId === call.id;
          const status = getUiStatus(call.id, isBridgeActive);
          const showControls = isBridgeActive && (status === "Connected" || status === "On Hold" || status === "Ringing");

          // NEW MOJO ACTIVE STYLE: If this specific card is the one on the phone
          if (isBridgeActive && showControls) {
            return (
              <div
                key={call.id || index}
                className="min-w-[280px] min-h-[130px] bg-[#000000] rounded-[22px] flex flex-col items-center justify-between p-4 shadow-2xl border border-white/5"
              >
                <div className="text-center w-full">
                  <h3 className="text-[18px] font-bold text-white leading-tight">
                    {call.fullName || call.name}
                  </h3>
                  <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full ${status === 'Ringing' ? 'bg-yellow-400/10 text-yellow-400' : 'bg-green-400/10 text-green-400'}`}>
                      {status}
                    </span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className={`text-[12px] font-bold text-white tracking-wider ${status === 'Ringing' ? 'animate-pulse text-yellow-400' : ''}`}>
                      {status === 'Ringing' ? 'Ringing...' : formatDuration(duration)}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full justify-center">
                  <button
                    onClick={toggleMute}
                    title={isMuted ? "Unmute" : "Mute"}
                    className={`w-10 h-10 flex justify-center items-center rounded-xl transition-all ${isMuted ? 'bg-[#EF4444] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {isMuted ? <MicOff size={18} /> : <Mic size={18} />}
                  </button>

                  <button
                    onClick={() => toggleHold(holdRecordingUrl)}
                    title={isHold ? "Resume Call" : "Hold"}
                    className={`w-10 h-10 flex justify-center items-center rounded-xl transition-all ${isHold ? 'bg-[#EAB308] text-white' : 'bg-white/10 text-white hover:bg-white/20'}`}
                  >
                    {isHold ? <Play size={18} /> : <Pause size={18} />}
                  </button>

                  <button
                    onClick={dropVoicemail}
                    disabled={isDroppingingVoicemail || !answeringMachineUrl}
                    title="Drop Voicemail & Next"
                    className="w-10 h-10 flex justify-center items-center rounded-xl bg-white/10 text-white hover:bg-white/20 transition-all disabled:opacity-10"
                  >
                    {isDroppingingVoicemail 
                      ? <Loader2 size={18} className="animate-spin text-gray-400" />
                      : <ArrowRightLeft size={18} />
                    }
                  </button>

                  <button
                    onClick={endCall}
                    title="Hang Up"
                    className="w-10 h-10 flex justify-center items-center rounded-xl bg-[#EF4444] hover:bg-[#DC2626] text-white shadow-lg active:scale-95 transition-all"
                  >
                    <PhoneOff size={18} />
                  </button>
                </div>
              </div>
            );
          }

          // ORIGINAL STYLE FOR OTHERS
          const getBorderColor = () => {
             if (isSelected) return 'border-[#FFCA06] shadow-md'; // Yellow selection border
             if (status === 'Ringing') return 'border-yellow-400 shadow-sm';
             if (status === 'Connected') return 'border-emerald-400 shadow-sm';
             if (status === 'Disconnected') return 'border-rose-400 shadow-sm';
             return 'border-gray-100 dark:border-slate-700 shadow-sm';
          };

          return (
            <div
              key={call.id || index}
              className={`min-w-[280px] min-h-[130px] 
                          bg-white dark:bg-slate-800 rounded-[22px] border-2 ${getBorderColor()}
                          flex flex-col items-center justify-center p-4
                          transition-all duration-200`}
            >
              <div className="text-center space-y-1 w-full">
                <h3 className="text-[18px] font-bold text-[#374151] dark:text-white truncate">
                  {call.fullName || call.name}
                </h3>
                <div className="flex items-center justify-center gap-1.5 text-[#6B7280] dark:text-gray-400">
                  <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusBadgeStyle(status)}`}>
                    {status}
                  </span>
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