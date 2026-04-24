import { useAppSelector } from "@/store/hooks";
import { useEffect, useRef } from "react";
import { Loader2, Mic, MicOff, Pause, Play, PhoneOff, ArrowRightLeft } from 'lucide-react';
import { useTwilio } from "@/providers/twilio.provider";
import { useLocation } from "react-router-dom";
import { VscCallOutgoing } from "react-icons/vsc";

type CallStatus = "Connected" | "On Hold" | "Hung Up" | "Queued" | "Ringing" | "Disconnected" | "Callback";

const getStatusBadgeStyle = (status: CallStatus) => {
  switch (status) {
    case 'Connected': return 'bg-[#E8FFF3] text-[#10B981]';
    case 'Ringing': return 'bg-blue-50 text-blue-500 animate-pulse';
    case 'On Hold': return 'bg-[#FEFCE8] text-[#CA8A04]';
    case 'Callback': return 'bg-orange-50 text-orange-500 animate-pulse';
    case 'Hung Up':
    case 'Disconnected': return 'bg-[#FEE2E2] text-[#EF4444]';
    default: return 'bg-gray-100 text-gray-600';
  }
};




const CallSection = ({ leadStatuses = {}, leadSids = {} }: { leadStatuses?: Record<string, string>, leadSids?: Record<string, string> }) => {
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
    duration,
    endCall,
    isCalling
  } = useTwilio();

  useEffect(() => {
    if (!isCalling) resetCallStatus();
  }, [currentContact?.id, resetCallStatus, isCalling]);

  const formatDuration = (s: number) => {
    const mins = Math.floor(s / 60);
    const secs = s % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getUiStatus = (isActive: boolean, leadId: string): CallStatus => {
    const bStatus = leadStatuses[leadId]?.toLowerCase();
    if (bStatus === 'answered' || bStatus === 'in-progress' || bStatus === 'connected') return "Connected";
    if (bStatus === 'ringing' || bStatus === 'initiated' || bStatus === 'queued') return "Ringing";
    if (bStatus === 'call_back' || bStatus === 'callback') return "Callback";
    if (bStatus === 'completed' || bStatus === 'failed' || bStatus === 'busy' || bStatus === 'no-answer' || bStatus === 'no_answer') return "Disconnected";
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

  useEffect(() => {
    const activeId = incomingContactId || currentContact?.id;
    if (activeId && cardRefs.current[activeId]) {
      cardRefs.current[activeId]?.scrollIntoView({
        behavior: 'smooth', block: 'nearest', inline: 'center'
      });
    }
  }, [incomingContactId, currentContact?.id]);

  if (queue.length === 0) return <div className="p-8 text-center text-gray-500">No contacts in queue</div>;

  return (
    <div className="w-full font-inter">
      <div
        ref={scrollContainerRef}
        className="flex space-x-4 py-4 px-2 overflow-x-auto no-scrollbar scroll-smooth"
      >
        {queue.map((call, index) => {
          const isActive = currentContact?.id === call.id;
          const status = getUiStatus(isActive, call.id);
          const isConnected = (status === "Connected" || status === "On Hold") && (incomingContactId === call.id || leadStatuses[call.id] === 'in-progress' || leadStatuses[call.id] === 'answered');
          const showControls = isActive && (status === "Connected" || status === "On Hold");

          if (isActive || isConnected) {
            return (
              <div
                key={call.id || index}
                ref={el => { cardRefs.current[call.id] = el; }}
                className={`min-w-[260px] min-h-[95px] rounded-[20px] flex flex-col items-center justify-between p-3 shadow-xl transition-all duration-300 border-2 
                           ${isConnected
                    ? 'bg-white dark:bg-slate-800 border-[#10B981] shadow-[#10B981]/10'
                    : 'bg-white dark:bg-slate-800 border-[#6366F1] shadow-[#6366F1]/10'}`}
              >
                <div className="text-center w-full">
                  <div className="flex items-center justify-between mb-0.5">
                    <h3 className="text-[15px] font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[160px]">
                      {call.name || call.fullName || "Unknown"}
                    </h3>
                    {isConnected && (
                      <span className="flex items-center gap-1 bg-[#10B981] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md animate-pulse">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 text-left flex items-center gap-1">
                    <VscCallOutgoing className="text-[#10B981]" /> {call.phone}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full 
                      ${status === 'Ringing' ? 'bg-yellow-400/10 text-yellow-500'
                        : status === 'Connected' ? 'bg-[#10B981]/20 text-[#10B981]'
                          : 'bg-gray-500/20 text-gray-400'}`}>
                      {status}
                    </span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className={`text-[11px] font-bold text-white tracking-wider ${status === 'Ringing' ? 'animate-pulse text-yellow-400' : ''}`}>
                      {status === 'Ringing' ? 'Ringing...' : (isConnected || status === 'Connected') ? formatDuration(duration) : '00:00'}
                    </span>
                  </div>
                </div>

                {showControls ? (
                  <div className="flex items-center gap-2 w-full justify-center mt-1">
                    <button onClick={toggleMute} className={`w-8 h-8 flex justify-center items-center rounded-lg shadow-sm ${isMuted ? 'bg-[#EF4444] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>
                      {isMuted ? <MicOff size={14} /> : <Mic size={14} />}
                    </button>
                    <button onClick={() => toggleHold(holdRecordingUrl)} className={`w-8 h-8 flex justify-center items-center rounded-lg shadow-sm ${isHold ? 'bg-[#EAB308] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>
                      {isHold ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                    <button onClick={dropVoicemail} disabled={isDroppingingVoicemail} className="w-8 h-8 flex justify-center items-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 shadow-sm disabled:opacity-30">
                      {isDroppingingVoicemail ? <Loader2 size={14} className="animate-spin" /> : <ArrowRightLeft size={14} />}
                    </button>
                    <button onClick={() => endCall(leadSids[call.id])} className="w-8 h-8 flex justify-center items-center rounded-lg bg-[#EF4444] text-white shadow-lg">
                      <PhoneOff size={14} />
                    </button>
                  </div>
                ) : (
                  <div className="text-[10px] text-gray-500 italic mt-1">Waiting...</div>
                )}
              </div>
            );
          }

          const cardBorderClass =
            status === 'Disconnected' || status === 'Hung Up'
              ? 'border-red-300 dark:border-red-700 bg-red-50 dark:bg-red-900/10'
              : status === 'Callback'
                ? 'border-orange-300 dark:border-orange-700 bg-orange-50 dark:bg-orange-900/10'
                : status === 'Connected'
                  ? 'border-green-300 dark:border-green-700'
                  : isActive
                    ? 'border-[#FFCA06] shadow-md'
                    : 'border-gray-100 dark:border-slate-700 shadow-sm';

          return (
            <div
              key={call.id || index}
              ref={el => { cardRefs.current[call.id] = el; }}
              className={`min-w-[260px] min-h-[95px] bg-white dark:bg-slate-800 rounded-[20px] border ${cardBorderClass} flex flex-col items-center justify-center p-3 transition-all duration-200`}
            >
              <div className="text-center space-y-0.5 w-full">
                <h3 className="text-[16px] font-bold text-[#374151] dark:text-white truncate">
                  {call.fullName || call.name}
                </h3>
                <div className="flex items-center justify-center gap-1 text-[#6B7280] dark:text-gray-400">
                  <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusBadgeStyle(status)}`}>
                    {status === 'Callback' ? 'Redialing...' : status}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <style dangerouslySetInnerHTML={{
        __html: `
        .no-scrollbar::-webkit-scrollbar { height: 6px; }
        .no-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .no-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .dark .no-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}} />
    </div>
  );
};

export default CallSection;