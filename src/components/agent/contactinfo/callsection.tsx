import { useAppSelector } from "@/store/hooks";
import { useEffect, useRef } from "react";
import { Loader2, Mic, MicOff, Pause, Play, PhoneOff, ArrowRightLeft, Star } from 'lucide-react';
import { useTwilio } from "@/providers/twilio.provider";
import { useLocation } from "react-router-dom";
import { VscCallOutgoing } from "react-icons/vsc";

type CallStatus = "Connected" | "On Hold" | "Hung Up" | "Queued" | "Ringing" | "Disconnected" | "Callback" | "Redialing";

const STATUS_PRIORITY: Record<string, number> = {
  'connected': 1,
  'in-progress': 1,
  'answered': 1,
  'on-hold': 1,
  'dialing': 2,
  'ringing': 2,
  'initiated': 2,
  'redialing': 3,
  'queued': 4,
  'pending': 4,
};

const getStatusBadgeStyle = (status: CallStatus) => {
  switch (status) {
    case 'Connected': return 'bg-[#10B981] text-white';
    case 'Ringing': return 'bg-blue-500 text-white animate-pulse';
    case 'Redialing': return 'bg-purple-500 text-white animate-pulse';
    case 'On Hold': return 'bg-[#CA8A04] text-white';
    case 'Callback': return 'bg-orange-500 text-white animate-pulse';
    case 'Hung Up':
    case 'Disconnected': return 'bg-[#EF4444] text-white';
    default: return 'bg-gray-500 text-white';
  }
};

const getTileStyle = (status: CallStatus, isActive: boolean, isConnected: boolean) => {
  if (isConnected || status === 'Connected') {
    return 'bg-[#E8FFF3] border-[#10B981] shadow-[#10B981]/10 dark:bg-[#064E3B]/20 dark:border-[#10B981]';
  }

  switch (status) {
    case 'On Hold':
      return 'bg-[#FEFCE8] border-[#EAB308] shadow-[#EAB308]/10 dark:bg-[#713F12]/20 dark:border-[#EAB308]';
    case 'Hung Up':
    case 'Disconnected':
      return 'bg-[#FEF2F2] border-[#EF4444] shadow-[#EF4444]/10 dark:bg-[#7F1D1D]/20 dark:border-[#EF4444]';
    case 'Ringing':
    case 'Redialing':
      return 'bg-[#EFF6FF] border-[#3B82F6] shadow-[#3B82F6]/10 dark:bg-[#1E3A8A]/20 dark:border-[#3B82F6] animate-pulse';
    case 'Callback':
      return 'bg-[#FFF7ED] border-[#F97316] shadow-[#F97316]/10 dark:bg-[#7C2D12]/20 dark:border-[#F97316]';
    default:
      if (isActive) {
        return 'bg-white border-[#FFCA06] shadow-[#FFCA06]/20 dark:bg-slate-800 dark:border-[#FFCA06]';
      }
      return 'bg-white border-gray-100 dark:bg-slate-800 dark:border-slate-700';
  }
};




const CallSection = ({
  leadStatuses = {},
  leadSids = {},
  activeQueueCardId,
  onSelectQueueCard,
  dialerMode,
  pacing = 1,
}: {
  leadStatuses?: Record<string, string>,
  leadSids?: Record<string, string>,
  activeQueueCardId?: string,
  onSelectQueueCard?: (queueCardId: string) => void,
  dialerMode?: string,
  pacing?: number,
}) => {
  const { queue, currentContact } = useAppSelector((state) => state.contacts);
  const location = useLocation();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const holdRecordingUrl = location.state?.holdRecordingUrl;
  const isPowerDialer = dialerMode === "power";

  const {
    incomingContactId,
    incomingQueueCardId,
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

  const activeSortId = incomingQueueCardId || activeQueueCardId || incomingContactId || currentContact?.id;

  const getSortStatus = (leadId: string) => {
    if (activeSortId === leadId) {
      switch (callStatus) {
        case 'connected':
        case 'on-hold':
          return 'connected';
        case 'ringing':
          return 'dialing';
        case 'idle':
          return 'pending';
        case 'disconnected':
          return 'disconnected';
        default:
          return 'pending';
      }
    }

    return leadStatuses[leadId]?.toLowerCase() ?? 'pending';
  };

  // ── Slot priority: Connected(1) → Ringing(2) → Redialing(3) → Disconnected(4) → Pending(5)
  const SLOT_PRIORITY: Record<string, number> = {
    connected: 1, 'in-progress': 1, answered: 1, 'on-hold': 1,
    dialing: 2, ringing: 2, initiated: 2,
    redialing: 3,
    disconnected: 4, completed: 4, failed: 4, busy: 4, 'no-answer': 4, 'no_answer': 4,
    pending: 5, queued: 5,
  };

  const IN_FLIGHT_STATES = new Set([
    'connected', 'in-progress', 'answered', 'on-hold',
    'dialing', 'ringing', 'initiated',
    'redialing',
    'disconnected', 'completed', 'failed', 'busy', 'no-answer', 'no_answer',
  ]);

  // Non-power-dialer: sorted full queue windowed around current contact
  const sortedQueue = [...queue].sort((a, b) => {
    const aPriority = STATUS_PRIORITY[getSortStatus(a.id)] ?? 5;
    const bPriority = STATUS_PRIORITY[getSortStatus(b.id)] ?? 5;
    return aPriority - bPriority;
  });
  const currentQueueIndex = Math.max(queue.findIndex((call) => call.id === activeSortId || call.contactId === activeSortId), 0);
  const visibleStartIndex = Math.min(currentQueueIndex, Math.max(queue.length - 3, 0));
  const visibleIds = new Set(queue.slice(visibleStartIndex, visibleStartIndex + 3).map((call) => call.id));

  // ── Power dialer: strict N-slot model ────────────────────────────────────────
  // Always show exactly `pacing` cards.
  // Slots 1..N are filled by in-flight contacts first (Ringing/Connected/Redialing/Disconnected).
  // Any remaining slots are filled from the front of the pending queue (they are
  // about to be dialed, so they show as "Ringing" once the backend picks them up).
  // Sort within the N cards: Connected → Ringing → Redialing → Disconnected → Pending.
  const slots = Math.max(1, pacing);

  const inFlightContacts = isPowerDialer
    ? [...queue].filter((c) => IN_FLIGHT_STATES.has(getSortStatus(c.id)))
    : [];

  const pendingContacts = isPowerDialer
    ? [...queue].filter((c) => !IN_FLIGHT_STATES.has(getSortStatus(c.id)))
    : [];

  const slotsRemaining = Math.max(0, slots - inFlightContacts.length);

  const visibleQueue = isPowerDialer
    ? [...inFlightContacts, ...pendingContacts.slice(0, slotsRemaining)]
        .sort((a, b) => {
          const ap = SLOT_PRIORITY[getSortStatus(a.id)] ?? 5;
          const bp = SLOT_PRIORITY[getSortStatus(b.id)] ?? 5;
          return ap - bp;
        })
        .slice(0, slots)
    : sortedQueue.filter((call) => visibleIds.has(call.id));

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
    // In power dialer, pending contacts filling empty slots are about to be dialed — show Ringing
    if (!isActive && isPowerDialer) return "Ringing";
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
    const activeId = incomingQueueCardId || activeQueueCardId || incomingContactId || currentContact?.id;
    if (activeId && cardRefs.current[activeId]) {
      cardRefs.current[activeId]?.scrollIntoView({
        behavior: 'smooth', block: 'center', inline: 'nearest'
      });
    }
  }, [incomingContactId, incomingQueueCardId, activeQueueCardId, currentContact?.id]);

  if (queue.length === 0) return <div className="p-8 text-center text-gray-500 font-bold uppercase tracking-widest text-[10px]">No contacts</div>;

  return (
    <div className="w-full h-full font-inter flex flex-col">
      <div
        ref={scrollContainerRef}
        className={`flex-1 py-1 px-1 ${
          isPowerDialer
            ? `grid gap-2 content-start overflow-hidden ${
                slots === 1 ? 'grid-cols-1' :
                slots <= 4 ? 'grid-cols-2' :
                'grid-cols-3'
              }`
            : "flex flex-col gap-3 overflow-y-auto no-scrollbar scroll-smooth"
        }`}
      >
        {visibleQueue.map((call, index) => {
          const isActive = activeQueueCardId ? activeQueueCardId === call.id : currentContact?.id === call.id;
          const status = getUiStatus(isActive, call.id);
          const isConnected = (status === "Connected" || status === "On Hold") && (incomingQueueCardId === call.id || incomingContactId === call.contactId || leadStatuses[call.id] === 'in-progress' || leadStatuses[call.id] === 'answered');
          const showControls = isActive && (status === "Connected" || status === "On Hold");
          const tileStyle = getTileStyle(status, isActive, isConnected);

          if (isActive || isConnected) {
            return (
              <div
                key={call.id || index}
                onClick={() => call.id && onSelectQueueCard?.(call.id)}
                ref={el => { cardRefs.current[call.id] = el; }}
                className={`w-full min-w-0 min-h-[110px] rounded-[18px] flex flex-col items-center justify-between p-2 shadow-lg transition-all duration-300 border-2 shrink-0 ${tileStyle}`}
              >
                <div className="text-center w-full">
                  <div className="flex items-center justify-between mb-0 gap-2">
                    <h3 className="text-[13px] font-bold text-slate-900 dark:text-white leading-tight truncate whitespace-nowrap overflow-hidden">
                      {call.name || call.fullName || "Unknown"}
                    </h3>
                    {isConnected && (
                      <span className="flex items-center gap-1 bg-[#10B981] text-white text-[8px] font-black px-1.5 py-0.5 rounded-md animate-pulse shrink-0">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className={`text-[10px] text-left flex items-center gap-1 truncate whitespace-nowrap overflow-hidden font-semibold
                    ${call.isBestNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                    <VscCallOutgoing className={call.isBestNumber ? 'text-emerald-500' : 'text-[#10B981]'} />
                    {call.phone}
                    {call.isBestNumber && <Star size={8} className="fill-emerald-500 text-emerald-500 shrink-0" />}
                  </p>
                  {call.totalPhones > 1 && (
                    <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500 text-left mt-0.5">
                      {call.phoneLabel || `Phone ${(call.phoneIndex ?? 0) + 1}`} of {call.totalPhones}
                    </p>
                  )}
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className={`text-[8px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full ${getStatusBadgeStyle(status)}`}>
                      {status}
                    </span>
                    <span className="text-gray-500 text-xs">•</span>
                    <span className={`text-[10px] font-bold text-slate-700 dark:text-slate-300 tracking-wider ${(status === 'Ringing' || status === 'Redialing') ? 'animate-pulse text-yellow-500' : ''}`}>
                      {(status === 'Ringing' || status === 'Redialing') ? `${status}...` : (isConnected || status === 'Connected') ? formatDuration(duration) : '00:00'}
                    </span>
                  </div>
                </div>

                {showControls ? (
                  <div className="flex items-center gap-1.5 w-full justify-center mt-1">
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

          return (
            <div
              key={call.id || index}
              onClick={() => call.id && onSelectQueueCard?.(call.id)}
              ref={el => { cardRefs.current[call.id] = el; }}
              className={`w-full min-w-0 min-h-[82px] rounded-[18px] border-2 ${tileStyle} flex flex-col items-center justify-center p-2 transition-all duration-200 shrink-0 cursor-pointer hover:shadow-md active:scale-[0.98]`}
            >
              <div className="text-center space-y-0.5 w-full">
                <h3 className={`text-[12px] font-bold truncate whitespace-nowrap overflow-hidden ${isActive ? 'text-slate-900 dark:text-white' : 'text-slate-500 dark:text-slate-400'}`}>
                  {call.fullName || call.name}
                </h3>
                <p className={`text-[10px] flex items-center justify-center gap-1 truncate whitespace-nowrap overflow-hidden font-semibold
                  ${call.isBestNumber ? 'text-emerald-600 dark:text-emerald-400' : 'text-slate-500 dark:text-slate-400'}`}>
                  <VscCallOutgoing className={call.isBestNumber ? 'text-emerald-500' : 'text-[#10B981]'} />
                  {call.phone}
                  {call.isBestNumber && <Star size={8} className="fill-emerald-500 text-emerald-500 shrink-0" />}
                </p>
                {call.totalPhones > 1 && (
                  <p className="text-[9px] font-bold text-slate-400 dark:text-slate-500">
                    {call.phoneLabel || `Phone ${(call.phoneIndex ?? 0) + 1}`} of {call.totalPhones}
                  </p>
                )}
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
