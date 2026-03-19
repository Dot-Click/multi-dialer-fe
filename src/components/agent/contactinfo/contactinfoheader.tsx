// ─── ContactInfoHeader.tsx ────────────────────────────────────────────────────
// Key fix: onCallStarted now receives the actual fromNumber that was used,
// so ContactInfo doesn't need to re-read stale state.

import { useState } from "react";
import { IoPlayOutline } from "react-icons/io5";
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
  dailyCount = 0,
  dailyLimit = 25,
}: ContactInfoHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [eventDefaults, setEventDefaults] = useState<{
    title: string;
    color: string;
    category: "TASK" | "FOLLOW_UP" | "APPOINTMENT";
  }>({ title: "", color: "#FFCA06", category: "TASK" });

  const { isCalling, appStatus, startCall, endCall } = useTwilio();
  const { data: regulatory } = useRegulatorySettings();

  console.log("regulatory", regulatory)

  const now = new Date();
  const currentStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
  console.log("currentStr", currentStr)

  const handleCallToggle = async () => {
    if (isCalling) {
      endCall();
      return;
    }

    // --- TCPA CHECK ---
    // console.log("tcpaFrom", tcpaFrom)
    // console.log("tcpaTo", tcpaTo
    const { tcpaFrom, tcpaTo } = regulatory || {};
    if (tcpaFrom && tcpaTo) {
      if (currentStr < tcpaFrom || currentStr > tcpaTo) {
        toast.error(`Compliance Alert: Calling is restricted outside ${tcpaFrom} - ${tcpaTo} (TCPA Hours).`);
        return;
      }
    }

    // Pick the callerId to use for this call
    const fromNumber = onPickNextCallerId
      ? onPickNextCallerId()
      : callerId || "+15203530496";

    if (!fromNumber) return; // All on cooldown or daily limit reached

    const phone =
      contact?.phones?.find((p: any) => p.isPrimary)?.number ||
      contact?.phones?.[0]?.number ||
      "+923413227282";

    try {
      await startCall(phone, fromNumber, contact?.id);
      // ✅ Pass the actual fromNumber used — no stale state reads
      if (onCallStarted) onCallStarted(fromNumber);
    } catch {
      // Error already toasted by startCall
    }
  };

  const handleOpenEventModal = (type: "TASK" | "FOLLOW_UP") => {
    setEventDefaults({
      title: `${type === "FOLLOW_UP" ? "Follow up with" : "Task for"} ${contact?.fullName || "Contact"}`,
      color: type === "FOLLOW_UP" ? "#3B82F6" : "#FFCA06",
      category: type,
    });
    setEventModalOpen(true);
  };

  return (
    <div className="w-full work-sans bg-white dark:bg-slate-800 border-t border-[#EBEDF0] dark:border-slate-800 shadow-sm">
      {/* Main Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left */}
        <div className="flex items-center gap-3 sm:gap-4">
          <h1 className="text-[#0E1011] dark:text-white text-xl sm:text-[22px] font-semibold">
            Live Dialing Screen
          </h1>
          <span
            className={`text-white text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full transition-colors ${dailyCount >= dailyLimit
              ? "bg-orange-500"
              : isCalling
                ? "bg-red-500"
                : "bg-[#07D95B]"
              }`}
          >
            {dailyCount >= dailyLimit
              ? "Daily Limit Reached"
              : isCalling
                ? "Active Call"
                : appStatus}
          </span>
          {totalContacts > 0 && (
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Queue: {currentIndex + 1} / {totalContacts}
            </span>
          )}
        </div>

        {/* Desktop Buttons */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={() => handleOpenEventModal("TASK")}
            className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#e0e2e6] dark:hover:bg-slate-600 transition-colors"
          >
            <HiPlus className="text-lg dark:text-white" />
            <span className="text-[#0E1011] dark:text-white text-sm font-medium">Task</span>
          </button>

          <button
            onClick={() => handleOpenEventModal("FOLLOW_UP")}
            className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#e0e2e6] dark:hover:bg-slate-600 transition-colors"
          >
            <HiPlus className="text-lg dark:text-white" />
            <span className="text-[#0E1011] dark:text-white text-sm font-medium">Follow Up</span>
          </button>

          <button
            onClick={handleCallToggle}
            className={`${isCalling
              ? "bg-red-500 text-white"
              : "bg-[#EBEDF0] dark:bg-slate-700 text-[#0E1011] dark:text-white"
              } rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:opacity-80 transition-all`}
          >
            {isCalling ? <FiPause className="text-xl" /> : <IoPlayOutline className="text-xl" />}
            <span className="text-sm font-medium">
              {isCalling ? "End Connection" : "Start"}
            </span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className={`bg-[#EBEDF0] dark:bg-slate-700 text-[#0E1011] dark:text-white rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#D8DCE1] dark:hover:bg-slate-600 transition-all ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <span className="text-sm font-medium">Prev</span>
            </button>

            <button
              onClick={onNext}
              disabled={currentIndex >= totalContacts - 1}
              className={`bg-[#0E1011] text-white rounded-[12px] flex items-center gap-1.5 py-3 px-5 hover:bg-[#1a1c1e] transition-colors ${currentIndex >= totalContacts - 1 ? "opacity-50 cursor-not-allowed" : ""
                }`}
            >
              <HiPlus className="text-xl" />
              <span className="text-sm font-medium">Dial Next Number</span>
            </button>
          </div>
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