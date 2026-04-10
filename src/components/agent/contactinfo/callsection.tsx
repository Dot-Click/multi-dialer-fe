import { useAppSelector } from "@/store/hooks";
import { useEffect, useRef } from "react";
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

const CallSection = ({ leadStatuses = {} }: { leadStatuses?: Record<string, string> }) => {
  const { queue, currentContact } = useAppSelector((state) => state.contacts);
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const holdRecordingUrl = location.state?.holdRecordingUrl;

  const {
    incomingContactId,
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

  // Map internal Twilio/Backend status to UI status
  const getUiStatus = (isActive: boolean, leadId: string): CallStatus => {
    const bStatus = leadStatuses[leadId]?.toLowerCase();
    
    if (bStatus === 'answered' || bStatus === 'in-progress' || bStatus === 'connected') return "Connected";
    if (bStatus === 'ringing' || bStatus === 'initiated' || bStatus === 'queued') return "Ringing";

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

  // Auto-scroll logic
  useEffect(() => {
    const activeId = incomingContactId || currentContact?.id;
    if (activeId && cardRefs.current[activeId]) {
      cardRefs.current[activeId]?.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
    }
  }, [incomingContactId, currentContact?.id]);

  // If no queue, show message
  if (queue.length === 0) {
    return <div className="p-8 text-center text-gray-500">No contacts in queue</div>;
  }

  return (
    <div className="w-full font-inter">
      {/* Horizontal Scroll Container */}
      <div 
        ref={scrollContainerRef}
        className="flex space-x-4 py-4 px-2 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {queue.map((call, index) => {
          const isActive = currentContact?.id === call.id;
          const isConnected = incomingContactId === call.id || leadStatuses[call.id] === 'in-progress' || leadStatuses[call.id] === 'answered';
          const status = getUiStatus(isActive, call.id);
          const showControls = isActive && (status === "Connected" || status === "On Hold" || status === "Ringing");

          // NEW MOJO ACTIVE STYLE - with enhanced connected highlighting
          if (isActive || isConnected) {
            return (
              <div
                key={call.id || index}
                ref={el => { cardRefs.current[call.id] = el; }}
                className={`min-w-[280px] min-h-[130px] rounded-[22px] flex flex-col items-center justify-between p-4 shadow-2xl transition-all duration-300 border-2 
                           ${isConnected 
                             ? 'bg-[#000000] border-[#10B981] shadow-[#10B981]/20' 
                             : 'bg-[#18181B] border-white/5 shadow-black/40'}`}
              >
                <div className="text-center w-full">
                  <div className="flex items-center justify-between mb-1">
                    <h3 className="text-[17px] font-bold text-white leading-tight truncate max-w-[180px]">
                      {call.fullName || call.name}
                    </h3>
                    {isConnected && (
                      <span className="flex items-center gap-1 bg-[#10B981] text-white text-[9px] font-black px-2 py-0.5 rounded-md animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center justify-center gap-1.5 mt-0.5">
                    <span className={`text-[10px] font-bold uppercase tracking-[0.15em] px-2 py-0.5 rounded-full 
                      ${status === 'Ringing' ? 'bg-yellow-400/10 text-yellow-400' 
                      : status === 'Connected' ? 'bg-[#10B981]/20 text-[#10B981]' 
                      : 'bg-gray-500/20 text-gray-400'}`}>
                      {status}
                    </span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className={`text-[12px] font-bold text-white tracking-wider ${status === 'Ringing' ? 'animate-pulse text-yellow-400' : ''}`}>
                      {status === 'Ringing' ? 'Ringing...' : (isConnected || status === 'Connected') ? formatDuration(duration) : '00:00'}
                    </span>
                  </div>
                </div>

                {showControls ? (
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
                ) : (
                  <div className="text-[11px] text-gray-500 italic">Waiting for connection...</div>
                )}
              </div>
            );
          }

          // ORIGINAL STYLE FOR OTHERS
          return (
            <div
              key={call.id || index}
              ref={el => { cardRefs.current[call.id] = el; }}
              className={`min-w-[280px] min-h-[130px] 
                          bg-white dark:bg-slate-800 rounded-[22px] border ${isActive ? 'border-[#FFCA06] shadow-md' : 'border-gray-100 dark:border-slate-700 shadow-sm'}
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