import { useAppSelector } from "@/store/hooks";
import { useEffect, useRef } from "react";
import { Loader2, Mic, MicOff, Pause, Play, PhoneOff, ArrowRightLeft } from 'lucide-react';
import { useTwilio } from "@/providers/twilio.provider";
import { useLocation } from "react-router-dom";
import { VscCallOutgoing } from "react-icons/vsc";
import CallOutcomes from "./calloutcomes";

type CallStatus = "Connected" | "On Hold" | "Hung Up" | "Queued" | "Ringing" | "Disconnected" | "Callback" | "Redialing";

const getStatusBadgeStyle = (status: CallStatus) => {
  switch (status) {
    case 'Connected': return 'bg-[#E8FFF3] text-[#10B981]';
    case 'Ringing': return 'bg-blue-50 text-blue-500 animate-pulse';
    case 'Redialing': return 'bg-purple-50 text-purple-500 animate-pulse';
    case 'On Hold': return 'bg-[#FEFCE8] text-[#CA8A04]';
    case 'Callback': return 'bg-orange-50 text-orange-500 animate-pulse';
    case 'Hung Up':
    case 'Disconnected': return 'bg-[#FEE2E2] text-[#EF4444]';
    default: return 'bg-gray-100 text-gray-600';
  }
};




const CallSection = ({ leadStatuses = {}, leadSids = {}, onNext }: { leadStatuses?: Record<string, string>, leadSids?: Record<string, string>, onNext?: () => void }) => {
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
    if (bStatus === 'redialing') return "Redialing";
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
        behavior: 'smooth', block: 'center', inline: 'nearest'
      });
    }
  }, [incomingContactId, currentContact?.id]);

  if (queue.length === 0) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">No contacts</div>;

  return (
    <div className="w-full h-full font-inter flex flex-col">
      <div
        ref={scrollContainerRef}
        className="flex-1 flex flex-col gap-3 py-2 px-1 overflow-y-auto no-scrollbar scroll-smooth"
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
                className={`w-full min-h-[90px] rounded-[18px] flex flex-col items-center justify-between p-3 shadow-lg transition-all duration-300 border-2 shrink-0
                           ${isConnected
                    ? 'bg-white dark:bg-slate-800 border-[#10B981] shadow-[#10B981]/10'
                    : 'bg-white dark:bg-slate-800 border-[#6366F1] shadow-[#6366F1]/10'}`}
              >
                <div className="text-center w-full">
                  <div className="flex items-center justify-between mb-0.5 gap-2">
                    <h3 className="text-[14px] font-bold text-slate-900 dark:text-white leading-tight truncate">
                      {call.name || call.fullName || "Unknown"}
                    </h3>
                    {isConnected && (
                      <span className="flex items-center gap-1 bg-[#10B981] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md animate-pulse shrink-0">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 text-left flex items-center gap-1">
                    <VscCallOutgoing className="text-[#10B981]" /> {call.phone}
                  </p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full 
                      ${(status === 'Ringing' || status === 'Redialing') ? 'bg-yellow-400/10 text-yellow-500'
                        : status === 'Connected' ? 'bg-[#10B981]/20 text-[#10B981]'
                          : 'bg-gray-500/20 text-gray-400'}`}>
                      {status}
                    </span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className={`text-[10px] font-bold text-slate-700 dark:text-slate-300 tracking-wider ${(status === 'Ringing' || status === 'Redialing') ? 'animate-pulse text-yellow-500' : ''}`}>
                      {(status === 'Ringing' || status === 'Redialing') ? `${status}...` : (isConnected || status === 'Connected') ? formatDuration(duration) : '00:00'}
                    </span>
                  </div>
                </div>

                {showControls ? (
                  <div className="flex items-center gap-1.5 w-full justify-center mt-2">
                    <button onClick={toggleMute} className={`w-7 h-7 flex justify-center items-center rounded-lg shadow-sm transition-all ${isMuted ? 'bg-[#EF4444] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>
                      {isMuted ? <MicOff size={12} /> : <Mic size={12} />}
                    </button>
                    <button onClick={() => toggleHold(holdRecordingUrl)} className={`w-7 h-7 flex justify-center items-center rounded-lg shadow-sm transition-all ${isHold ? 'bg-[#EAB308] text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-600'}`}>
                      {isHold ? <Play size={12} /> : <Pause size={12} />}
                    </button>
                    <button onClick={dropVoicemail} disabled={isDroppingingVoicemail} className="w-7 h-7 flex justify-center items-center rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 shadow-sm disabled:opacity-30">
                      {isDroppingingVoicemail ? <Loader2 size={12} className="animate-spin" /> : <ArrowRightLeft size={12} />}
                    </button>
                    <button onClick={() => endCall(leadSids[call.id])} className="w-7 h-7 flex justify-center items-center rounded-lg bg-[#EF4444] text-white shadow-lg">
                      <PhoneOff size={12} />
                    </button>
                  </div>
                ) : (
                  <div className="text-[9px] text-gray-400 font-bold uppercase tracking-widest mt-1">Waiting...</div>
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
                    ? 'border-[#FFCA06] shadow-md bg-white dark:bg-slate-800'
                    : 'border-gray-100 dark:border-slate-700 shadow-sm bg-gray-50/50 dark:bg-slate-800/50';

          return (
            <div
              key={call.id || index}
              ref={el => { cardRefs.current[call.id] = el; }}
              className={`w-full min-h-[70px] rounded-[18px] border ${cardBorderClass} flex flex-col items-center justify-center p-3 transition-all duration-200 shrink-0 cursor-pointer hover:shadow-md active:scale-[0.98]`}
            >
              <div className="text-center space-y-0.5 w-full">
                <h3 className={`text-[13px] font-bold truncate ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  {call.fullName || call.name}
                </h3>
                <div className="flex items-center justify-center gap-1">
                  <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusBadgeStyle(status)}`}>
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
        .no-scrollbar::-webkit-scrollbar { width: 4px; }
        .no-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .no-scrollbar::-webkit-scrollbar-thumb { background: #E5E7EB; border-radius: 10px; }
        .dark .no-scrollbar::-webkit-scrollbar-thumb { background: #334155; }
      `}} />
    </div>
  );
};

export default CallSection;