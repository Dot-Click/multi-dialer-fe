import { useState } from "react";
import { IoPlayOutline } from "react-icons/io5";
import { HiPlus } from "react-icons/hi";
import { FiPause } from "react-icons/fi";
import { RxHamburgerMenu } from "react-icons/rx";

const ContactInfoHeader = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="w-full work-sans bg-white border-t border-[#EBEDF0] shadow-sm">
      {/* Main Header Bar */}
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Left - Title + Status */}
        <div className="flex items-center gap-3 sm:gap-4">
          <h1 className="text-[#0E1011] text-xl sm:text-[22px] font-semibold">
            Live Dialing Screen
          </h1>
          <span className="bg-[#07D95B] text-white text-xs sm:text-sm font-semibold px-2.5 py-1 rounded-full">
            Active Call
          </span>
        </div>

        {/* Desktop Buttons - hidden on mobile */}
        <div className="hidden md:flex items-center gap-3">
          <button className="bg-[#EBEDF0] rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#e0e2e6] transition-colors">
            <HiPlus className="text-lg" />
            <span className="text-[#0E1011] text-sm font-medium">Task</span>
          </button>

          <button className="bg-[#EBEDF0] rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#e0e2e6] transition-colors">
            <HiPlus className="text-lg" />
            <span className="text-[#0E1011] text-sm font-medium">Follow Up</span>
          </button>

          <button className="bg-[#EBEDF0] rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#e0e2e6] transition-colors">
            <IoPlayOutline className="text-xl" />
            <span className="text-[#0E1011] text-sm font-medium">Start</span>
          </button>

          <button className="bg-[#EBEDF0] rounded-[12px] flex items-center gap-1.5 py-3 px-4 hover:bg-[#e0e2e6] transition-colors">
            <FiPause className="text-xl" />
            <span className="text-[#0E1011] text-sm font-medium">Pause</span>
          </button>

          <button className="bg-[#0E1011] text-white rounded-[12px] flex items-center gap-1.5 py-3 px-5 hover:bg-[#1a1c1e] transition-colors">
            <HiPlus className="text-xl" />
            <span className="text-sm font-medium">Dial Next Number</span>
          </button>
        </div>

        {/* Mobile Hamburger - visible only on mobile */}
        <button
          className="md:hidden text-[#0E1011] p-2 -mr-2"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle menu"
        >
          <RxHamburgerMenu size={28} />
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#EBEDF0] bg-white px-4 py-5 flex flex-col gap-3">
          <button className="bg-[#EBEDF0] rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 active:bg-[#d8dade]">
            <HiPlus className="text-xl" />
            <span className="text-[#0E1011] font-medium">Task</span>
          </button>

          <button className="bg-[#EBEDF0] rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 active:bg-[#d8dade]">
            <HiPlus className="text-xl" />
            <span className="text-[#0E1011] font-medium">Follow Up</span>
          </button>

          <button className="bg-[#EBEDF0] rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 active:bg-[#d8dade]">
            <IoPlayOutline className="text-2xl" />
            <span className="text-[#0E1011] font-medium">Start</span>
          </button>

          <button className="bg-[#EBEDF0] rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 active:bg-[#d8dade]">
            <FiPause className="text-2xl" />
            <span className="text-[#0E1011] font-medium">Pause</span>
          </button>

          <button className="bg-[#0E1011] text-white rounded-[12px] flex items-center justify-center gap-2 py-3 px-4 active:bg-[#1a1c1e]">
            <HiPlus className="text-2xl" />
            <span className="font-medium">Dial Next Number</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default ContactInfoHeader;


// old code
//  <div className="flex flex-wrap justify-between items-center gap-4">

//         <div className="flex flex-wrap items-center gap-4">

//           <div className="text-sm min-w-[80px]">
//             <span className="font-semibold text-gray-800">210/314</span>
//             <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
//               <div className="h-full bg-black rounded-full" style={{ width: "67%" }}></div>
//             </div>
//           </div>

//           <div className="flex gap-2 flex-wrap">
//             <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-200/80 text-gray-900 font-medium text-xs rounded-lg hover:bg-gray-300 transition">
//               <LuSendHorizontal className="text-base" />
//               <span className="hidden sm:inline">Send Leads</span>
//             </button>

//             <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-200/80 text-gray-900 font-medium text-xs rounded-lg hover:bg-gray-300 transition">
//               <HiPlus className="text-base" />
//               <span className="hidden sm:inline">Appointment</span>
//             </button>
//           </div>
//         </div>

//         <div className="flex items-center gap-2 sm:gap-3">

//           <button
//             className=" flex items-center justify-center bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-100 transition relative"
//             aria-label="Record"
//           >
//             <BsRecord2 className="text-red-500 text-2xl" />
//           </button>

//           <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-200/80 text-gray-900 font-medium text-xs rounded-lg hover:bg-gray-300 transition">
//             <IoPlayOutline className="text-base" />
//             <span className="hidden sm:inline">Start</span>
//           </button>

//           <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-200/80 text-gray-900 font-medium text-xs rounded-lg hover:bg-gray-300 transition">
//             <img src={contactinfoheadericon} alt="contactinfoheadericon" className="w-4 object-contain" />
//             <span className="hidden sm:inline">Hang Up & Leave</span>
//           </button>

//         </div>

//       </div>