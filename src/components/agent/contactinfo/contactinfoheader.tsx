import { IoPaperPlaneOutline } from "react-icons/io5";
import { HiPlus } from "react-icons/hi";
import { FaPlay, FaPhoneSlash } from "react-icons/fa";
import { BsRecord2 } from "react-icons/bs";

const ContactInfoHeader = () => {
  return (
    <div className="w-full bg-gray-50 border-t border-gray-200 px-4 sm:px-6 py-3">
      <div className="flex flex-wrap justify-between items-center gap-4">

        {/* LEFT SECTION */}
        <div className="flex flex-wrap items-center gap-4">

          {/* Progress */}
          <div className="text-sm min-w-[80px]">
            <span className="font-semibold text-gray-800">210/314</span>
            <div className="w-24 h-1.5 bg-gray-200 rounded-full mt-1 overflow-hidden">
              <div className="h-full bg-black rounded-full" style={{ width: "67%" }}></div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 flex-wrap">
            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-200/80 text-gray-900 font-medium text-xs rounded-lg hover:bg-gray-300 transition">
              <IoPaperPlaneOutline className="text-sm" />
              <span className="hidden sm:inline">Send Leads</span>
            </button>

            <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-200/80 text-gray-900 font-medium text-xs rounded-lg hover:bg-gray-300 transition">
              <HiPlus className="text-sm" />
              <span className="hidden sm:inline">Appointment</span>
            </button>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-2 sm:gap-3">

          {/* ✅ RECORD BUTTON WITH ICON */}
          <button
            className=" flex items-center justify-center bg-gray-200 border border-gray-300 rounded-lg hover:bg-gray-100 transition relative"
            aria-label="Record"
          >
            <BsRecord2 className="text-red-500 text-2xl" />
          </button>

          {/* Start Button */}
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-200/80 text-gray-900 font-medium text-xs rounded-lg hover:bg-gray-300 transition">
            <FaPlay className="text-sm" />
            <span className="hidden sm:inline">Start</span>
          </button>

          {/* Hang Up */}
          <button className="flex items-center gap-2 px-3 sm:px-4 py-2 bg-gray-200/80 text-gray-900 font-medium text-xs rounded-lg hover:bg-gray-300 transition">
            <FaPhoneSlash className="text-sm" />
            <span className="hidden sm:inline">Hang Up & Leave</span>
          </button>

        </div>

      </div>
    </div>
  );
};

export default ContactInfoHeader;
