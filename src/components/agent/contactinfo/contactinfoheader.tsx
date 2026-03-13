import { useState } from "react";
import { IoPlayOutline } from "react-icons/io5";
import { HiPlus } from "react-icons/hi";
import { FiPause } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";
import { useTwilio } from "@/providers/twilio.provider";
import AddEventForm from "@/components/modal/addeventmodal";

interface ContactInfoHeaderProps {
  settingsInfo?: any;
  contact?: any;
  onNext?: () => void;
  onPrev?: () => void;
  currentIndex?: number;
  totalContacts?: number;
  callerId?: string | null;
  onPickNextCallerId?: () => string | null;
  onCallStarted?: () => void;
  dailyCount?: number;
  dailyLimit?: number;
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
  dailyLimit = 25
}: ContactInfoHeaderProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isEventModalOpen, setEventModalOpen] = useState(false);
  const [eventDefaults, _] = useState({ title: '', color: '#FFCA06' });
  const { isCalling, appStatus, startCall, endCall } = useTwilio();

  const handleCallToggle = async () => {
    if (isCalling) {
      endCall();
    } else {
      // Use rotation logic if provided
      const fromNumber = onPickNextCallerId ? onPickNextCallerId() : (callerId || "+15203530496"); 
      
      if (!fromNumber) return; // Daily limit reached or all in cooldown

      console.log("Starting call from:", fromNumber);
      
      // Use the primary phone from the contact's phones array
      const phone = contact?.phones?.find((p: any) => p.isPrimary)?.number || contact?.phones?.[0]?.number || "+923413227282";
      
      try {
        await startCall(phone, fromNumber, contact?.id);
        if (onCallStarted) onCallStarted();
      } catch (err) {
        // Error already handled by toast in startCall
      }
    }
  };

  return (
    <div className="w-full work-sans bg-white dark:bg-slate-900 border-t border-[#EBEDF0] dark:border-slate-800 shadow-sm">
      {/* Main Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left - Title + Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          <h1 className="text-[#0E1011] dark:text-white text-xl sm:text-[22px] font-semibold">
            Live Dialing Screen
          </h1>
          <span className={`text-white text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full transition-colors ${dailyCount >= dailyLimit ? 'bg-orange-500' : isCalling ? 'bg-red-500' : 'bg-[#07D95B]'}`}>
            {dailyCount >= dailyLimit ? 'Daily Limit Reached' : isCalling ? 'Active Call' : appStatus}
          </span>
          {totalContacts > 0 && (
            <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">
              Queue: {currentIndex + 1} / {totalContacts}
            </span>
          )}
        </div>

        {/* Desktop Buttons - hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          <button className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#e0e2e6] dark:hover:bg-slate-600 transition-colors">
            <HiPlus className="text-lg dark:text-white" />
            <span className="text-[#0E1011] dark:text-white text-sm font-medium">Task</span>
          </button>

          <button className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#e0e2e6] dark:hover:bg-slate-600 transition-colors">
            <HiPlus className="text-lg dark:text-white" />
            <span className="text-[#0E1011] dark:text-white text-sm font-medium">Follow Up</span>
          </button>

          <button
            onClick={handleCallToggle}
            className={`${isCalling ? 'bg-red-500 text-white' : 'bg-[#EBEDF0] dark:bg-slate-700 text-[#0E1011] dark:text-white'} rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:opacity-80 transition-all`}
          >
            {isCalling ? <FiPause className="text-xl" /> : <IoPlayOutline className="text-xl" />}
            <span className="text-sm font-medium">{isCalling ? 'End Connection' : 'Start'}</span>
          </button>

          <button className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#e0e2e6] dark:hover:bg-slate-600 transition-colors">
            <FiPause className="text-xl dark:text-white" />
            <span className="text-[#0E1011] dark:text-white text-sm font-medium">Pause</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className={`bg-[#EBEDF0] dark:bg-slate-700 text-[#0E1011] dark:text-white rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#D8DCE1] dark:hover:bg-slate-600 transition-all ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="text-sm font-medium">Prev</span>
            </button>

            <button
              onClick={onNext}
              disabled={currentIndex >= totalContacts - 1}
              className={`bg-[#0E1011] text-white rounded-[12px] flex items-center gap-1.5 py-3 px-5 hover:bg-[#1a1c1e] transition-colors ${currentIndex >= totalContacts - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <HiPlus className="text-xl" />
              <span className="text-sm font-medium">Dial Next Number</span>
            </button>
          </div>
        </div>

        {/* Mobile Hamburger - visible only on mobile */}
        <button
          className="md:hidden text-[#0E1011] dark:text-white p-2 -mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <RxHamburgerMenu size={28} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#EBEDF0] dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-5 flex flex-col gap-3">
          <button className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 active:bg-[#d8dade] dark:active:bg-slate-600">
            <HiPlus className="text-xl dark:text-white" />
            <span className="text-[#0E1011] dark:text-white font-medium">Task</span>
          </button>

          <button className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 active:bg-[#d8dade] dark:active:bg-slate-600">
            <HiPlus className="text-xl dark:text-white" />
            <span className="text-[#0E1011] dark:text-white font-medium">Follow Up</span>
          </button>

          <button
            onClick={handleCallToggle}
            className={`rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 transition-colors ${isCalling ? 'bg-red-500 text-white' : 'bg-[#EBEDF0] dark:bg-slate-700 text-[#0E1011] dark:text-white'}`}
          >
            {isCalling ? <FiPause className="text-2xl" /> : <IoPlayOutline className="text-2xl" />}
            <span className="font-medium">{isCalling ? 'End Connection' : 'Start'}</span>
          </button>

          <button className="bg-[#EBEDF0] dark:bg-slate-700 rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 active:bg-[#d8dade] dark:active:bg-slate-600">
            <FiPause className="text-2xl dark:text-white" />
            <span className="text-[#0E1011] dark:text-white font-medium">Pause</span>
          </button>

          <div className="flex gap-2">
            <button
              onClick={onPrev}
              disabled={currentIndex === 0}
              className={`flex-1 bg-[#EBEDF0] dark:bg-slate-700 text-[#0E1011] dark:text-white rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 active:bg-[#d8dade] dark:active:bg-slate-600 ${currentIndex === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <span className="font-medium">Previous</span>
            </button>

            <button
              onClick={onNext}
              disabled={currentIndex >= totalContacts - 1}
              className={`flex-1 bg-[#0E1011] dark:bg-slate-900 text-white rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 active:bg-[#1a1c1e] ${currentIndex >= totalContacts - 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
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
      />
    </div>
  );
};

export default ContactInfoHeader;