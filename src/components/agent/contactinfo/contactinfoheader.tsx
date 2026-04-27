// ─── ContactInfoHeader.tsx ────────────────────────────────────────────────────
// Key fix: onCallStarted now receives the actual fromNumber that was used,
// so ContactInfo doesn't need to re-read stale state.

import { useState, useEffect, useRef, useCallback } from "react";
import { PhoneOff, ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { IoPlayOutline, IoArrowBack } from "react-icons/io5";
import { HiPlus } from "react-icons/hi";
import { FiPause } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import { useTwilio } from "@/providers/twilio.provider";
import AddEventForm from "@/components/modal/addeventmodal";
import { useRegulatorySettings } from "@/hooks/useSystemSettings";
import toast from "react-hot-toast";

interface ContactInfoHeaderProps {
  settingsInfo?: any;
  contact?: any;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalContacts?: number;
  callerId?: string | null;
  onPickNextCallerId?: () => string | null;
  onCallStarted?: (fromNumber: string) => void; // ← now receives the number used
  dailyCount?: number;
  dailyLimit?: number;
  onholdUrl?: string;
  autoDial?: boolean;
  onAutoDialStarted?: () => void;
  dialerMode?: string;
  onStartSimultaneousDialer?: () => void;
  onStopSimultaneousDialer?: () => void;
}

const ContactInfoHeader = ({
  contact,
  onNext,
  onPrev,
  currentIndex = 0,
  totalContacts = 0,
  callerId,
  onPickNextCallerId,
  onCallStarted,
  autoDial,
  onAutoDialStarted,
  dialerMode,
  onStartSimultaneousDialer,
  onStopSimultaneousDialer,
}: ContactInfoHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const hasTriggeredAutoDialRef = useRef(false);
  const shouldAutoCallRef = useRef(false);
  const navigatedFromIdRef = useRef<string | null>(null);
  const navigate = useNavigate();
  const [eventDefaults, setEventDefaults] = useState<{
    title: string;
    color: string;
    category: "TASK" | "FOLLOW_UP" | "APPOINTMENT";
  }>({ title: "", color: "#FFCA06", category: "TASK" });

  const { isCalling, startCall, endCall } = useTwilio();
  const { data: regulatory, isLoading: isRegulatoryLoading } = useRegulatorySettings();

  const handleCallToggle = useCallback(async () => {
    if (isRegulatoryLoading) {
      toast("Syncing compliance settings...", { icon: '⏳' });
      return;
    }

    if (isCalling) {
      if (dialerMode === "power" && onStopSimultaneousDialer) {
        onStopSimultaneousDialer();
      }
      endCall();
      return;
    }

    // --- TCPA CHECK (timezone-aware, matching backend logic) ---
    const { tcpaFrom, tcpaTo } = regulatory || {};
    if (tcpaFrom && tcpaTo) {
      const timeZone = regulatory?.companyTimeZone || "UTC";
      let currentStr = "";
      try {
        const formatter = new Intl.DateTimeFormat('en-US', { timeZone, hour: '2-digit', minute: '2-digit', hour12: false });
        const parts = formatter.formatToParts(new Date());
        const hr = parts.find(p => p.type === 'hour')?.value || "00";
        const mn = parts.find(p => p.type === 'minute')?.value || "00";
        const adjustedHr = hr === '24' ? '00' : hr;
        currentStr = `${adjustedHr}:${mn}`;
      } catch {
        const now = new Date();
        currentStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
      }

      const isAllowed = tcpaFrom <= tcpaTo
        ? (currentStr >= tcpaFrom && currentStr <= tcpaTo)
        : (currentStr >= tcpaFrom || currentStr <= tcpaTo);

      if (!isAllowed) {
        toast.error(`Compliance Alert: Calling is restricted outside ${tcpaFrom} - ${tcpaTo} (TCPA Hours).`);
        return;
      }
    }

    if (dialerMode === "power" && onStartSimultaneousDialer) {
      onStartSimultaneousDialer();
      return;
    }

    // Pick the callerId to use for this call
    const fromNumber = onPickNextCallerId
      ? onPickNextCallerId()
      : callerId || "+15203530496";

    if (!fromNumber) return; // All on cooldown or daily limit reached

    const phone =
      contact?.phones?.find((p: any) => p.isPrimary)?.number ||
      contact?.phones?.[0]?.number ||
      "";

    try {
      await startCall(phone, fromNumber, contact?.id);
      // ✅ Pass the actual fromNumber used — no stale state reads
      if (onCallStarted) onCallStarted(fromNumber);
    } catch {
      // Error already toasted by startCall
    }
  }, [
    isRegulatoryLoading,
    isCalling,
    dialerMode,
    regulatory,
    onStopSimultaneousDialer,
    endCall,
    onStartSimultaneousDialer,
    onPickNextCallerId,
    callerId,
    contact,
    startCall,
    onCallStarted
  ]);

  const handleNavigateWithCall = useCallback(async (direction: 'next' | 'prev') => {
    if (isCalling) {
      await endCall();
    }

    shouldAutoCallRef.current = true;
    navigatedFromIdRef.current = contact?.id || null;

    if (direction === 'next' && onNext) {
      onNext();
    } else if (direction === 'prev' && onPrev) {
      onPrev();
    }
  }, [isCalling, endCall, onNext, onPrev, contact?.id]);

  const handleHangupAndLeave = async () => {
    if (isCalling) {
      await endCall();
    }
    const path = dialerMode === 'power' 
      ? (localStorage.getItem('user_role') === 'ADMIN' ? '/admin/data-dialer' : '/data-dialer')
      : -1;
    
    if (path === -1) {
      navigate(-1);
    } else {
      navigate(path as string);
    }
  };

  // Effect to trigger call when contact changes and shouldAutoCallRef is set
  useEffect(() => {
    if (
      shouldAutoCallRef.current && 
      contact?.id && 
      !isCalling && 
      contact.id !== navigatedFromIdRef.current
    ) {
      shouldAutoCallRef.current = false;
      navigatedFromIdRef.current = null;
      handleCallToggle();
    }
  }, [contact?.id, isCalling, handleCallToggle]);

  const handleOpenEventModal = (type: "TASK" | "FOLLOW_UP") => {
    setEventDefaults({
      title: `${type === "FOLLOW_UP" ? "Follow up with" : "Task for"} ${contact?.fullName || "Contact"}`,
      color: type === "FOLLOW_UP" ? "#3B82F6" : "#FFCA06",
      category: type,
    });
    setEventModalOpen(true);
  };

  // ─── Power Dialer Auto-Dial Hook ───
  useEffect(() => {
    if (!autoDial) {
      hasTriggeredAutoDialRef.current = false;
    }
  }, [autoDial]);

  useEffect(() => {
    if (!autoDial || isCalling || dialerMode === "power" || hasTriggeredAutoDialRef.current) return;

    hasTriggeredAutoDialRef.current = true;
    handleCallToggle();
    if (onAutoDialStarted) onAutoDialStarted();
  }, [autoDial, isCalling, dialerMode, handleCallToggle, onAutoDialStarted]);

  return (
    <div className="w-full work-sans bg-white dark:bg-slate-800 border-t border-[#EBEDF0] dark:border-slate-800 shadow-sm">
      {/* Main Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left */}
        {/* Left: Progress indicator as seen in SS */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-gray-100 dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 transition-all group"
            title="Go Back"
          >
            <IoArrowBack className="text-gray-500 group-hover:text-gray-900 dark:text-gray-400 dark:group-hover:text-white" />
            <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">Back</span>
          </button>

          <div className="flex items-center gap-4">
            {dialerMode === "manual" && (
              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => handleNavigateWithCall('prev')}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                  title="Previous Contact"
                >
                  <ChevronLeft className="w-5 h-5 text-gray-500 group-hover:text-[#FFCA06] transition-colors" />
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">Prev</span>
                </button>
                <button
                  onClick={() => handleNavigateWithCall('next')}
                  disabled={currentIndex >= totalContacts - 1}
                  className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gray-50 border border-gray-100 hover:bg-white dark:bg-slate-700 dark:border-slate-600 dark:hover:bg-slate-600 transition-all disabled:opacity-30 disabled:cursor-not-allowed group"
                  title="Next Contact"
                >
                  <span className="text-sm font-semibold text-gray-600 dark:text-gray-300 group-hover:text-gray-900 dark:group-hover:text-white">Next</span>
                  <ChevronRight className="w-5 h-5 text-gray-500 group-hover:text-[#FFCA06] transition-colors" />
                </button>
              </div>
            )}

            <div className="flex flex-col gap-1 min-w-[120px]">
              <div className="flex justify-between items-end">
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">
                  {currentIndex + 1}/{totalContacts}
                </span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 h-2.5 rounded-full overflow-hidden">
                 <div 
                   className="bg-gray-600 dark:bg-gray-400 h-full transition-all duration-300" 
                   style={{ width: `${(totalContacts > 0 ? ((currentIndex + 1) / totalContacts) * 100 : 0)}%` }} 
                 />
              </div>
            </div>
          </div>
        </div>

        {/* Desktop Buttons matched to SS */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleOpenEventModal("TASK")}
            className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center gap-2 py-2.5 px-4 hover:bg-[#e0e2e6] transition-colors"
          >
            <HiPlus className="text-xl rotate-180 dark:text-white" />
            <span className="text-[#0E1011] dark:text-white text-sm font-semibold">Tasks</span>
          </button>

          <button
            onClick={() => handleOpenEventModal("FOLLOW_UP")}
            className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center gap-2 py-2.5 px-4 hover:bg-[#e0e2e6] transition-colors"
          >
            <HiPlus className="text-xl dark:text-white" />
            <span className="text-[#0E1011] dark:text-white text-sm font-semibold">Appointment</span>
          </button>

          <div className="w-px h-8 bg-gray-200 dark:bg-slate-700 mx-1" />

          {/* Call Status Indicator from SS (Dot next to Start) */}
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-red-200 bg-red-50 dark:border-red-900/40 dark:bg-red-900/20">
             <div className={`w-3 h-3 rounded-full ${isCalling ? 'bg-red-500 animate-pulse' : 'bg-red-200'}`} />
          </div>

          <button
            onClick={handleCallToggle}
            disabled={dialerMode === "manual" && isCalling}
            className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center gap-2 py-2.5 px-6 hover:bg-[#e0e2e6] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isCalling && dialerMode === "power" ? (
              <FiPause className="text-xl dark:text-white" />
            ) : (
              <IoPlayOutline className="text-xl dark:text-white" />
            )}
            <span className="text-[#0E1011] dark:text-white text-sm font-semibold">
              {isCalling && dialerMode === "power" ? "Pause" : "Start"}
            </span>
          </button>

          <button
            onClick={handleHangupAndLeave}
            className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center gap-2 py-2.5 px-4 hover:bg-red-100 dark:hover:bg-red-900/40 transition-all"
          >
            <PhoneOff className="text-xl dark:text-white" />
            <span className="text-[#0E1011] dark:text-white text-sm font-semibold">Hang Up & Leave</span>
          </button>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden text-[#0E1011] dark:text-white p-2 -mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <RxHamburgerMenu size={28} />
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#EBEDF0] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-5 flex flex-col gap-3">
          <button
            onClick={() => handleOpenEventModal("TASK")}
            className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center justify-center gap-2 py-3 px-4"
          >
            <HiPlus className="text-xl dark:text-white" />
            <span className="text-[#0E1011] dark:text-white font-medium">Task</span>
          </button>

          <button
            onClick={() => handleOpenEventModal("FOLLOW_UP")}
            className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center justify-center gap-2 py-3 px-4"
          >
            <HiPlus className="text-xl dark:text-white" />
            <span className="text-[#0E1011] dark:text-white font-medium">Follow Up</span>
          </button>

          <button
            onClick={handleCallToggle}
            className={`rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 transition-colors ${isCalling
              ? "bg-red-500 text-white"
              : "bg-[#EBEDF0] dark:bg-slate-700 text-[#0E1011] dark:text-white"
              }`}
          >
            {isCalling ? <FiPause className="text-2xl" /> : <IoPlayOutline className="text-2xl" />}
            <span className="font-medium">{isCalling ? "End Connection" : "Start"}</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className={`flex-1 bg-[#EBEDF0] dark:bg-slate-700 text-[#0E1011] dark:text-white rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <span className="font-medium">Previous</span>
            </button>

            <button
              onClick={onNext}
              disabled={currentIndex >= totalContacts - 1}
              className={`flex-1 bg-[#0E1011] dark:bg-slate-900 text-white rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 ${currentIndex >= totalContacts - 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <HiPlus className="text-2xl" />
              <span className="font-medium">Next</span>
            </button>
          </div>
        </div>
      )}

      <AddEventForm
        open={isEventModalOpen}
        onClose={() => setEventModalOpen(false)}
        contactId={contact?.id}
        defaultTitle={eventDefaults.title}
        defaultColor={eventDefaults.color}
        defaultCategory={eventDefaults.category}
      />
    </div>
  );
};

export default ContactInfoHeader;
