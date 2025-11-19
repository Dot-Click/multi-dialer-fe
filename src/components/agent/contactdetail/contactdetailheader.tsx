import { useState } from "react";
import {
  MdKeyboardArrowDown,
  MdMoreVert,
} from "react-icons/md";
import {
  IoAddOutline,
  IoCloseOutline,
} from "react-icons/io5";
import {
  IoIosArrowForward,
  IoIosArrowBack,
} from "react-icons/io";
import AppointmentModal from "@/components/modal/appointmentmodal";
import TaskModal from "@/components/modal/taskmodal";
import CallBackModal from "@/components/modal/callbackmodal";
import TakeActionModal from "@/components/modal/takeactionmodal";

const ContactDetailHeader = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [isTaskModalOpen, setTaskModalOpen] = useState(false);
  const [isCallBackModalOpen, setCallBackModalOpen] = useState(false);
  const [isActionModalOpen, setActionModalOpen] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const headerLinks = [
    {
      id: 1,
      name: "Appointment",
      icon: <IoAddOutline />,
      onClick: () => setModalOpen(true),
    },
    {
      id: 2,
      name: "Task",
      icon: <IoAddOutline />,
      onClick: () => setTaskModalOpen(true),
    },
    {
      id: 3,
      name: "Call Back",
      icon: <IoAddOutline />,
      onClick: () => setCallBackModalOpen(true),
    },
  ];

  return (
    <>
      {/* HEADER */}
      <header className="shadow-sm bg-white flex items-center justify-between px-3 sm:px-5 md:px-6 w-full h-16">
        {/* LEFT SECTION */}
        <div className="flex items-center gap-2 sm:gap-3 md:gap-4">
          {/* Action button */}
          <button className="flex items-center gap-1.5 sm:gap-2 py-[12px] pr-[17px] pl-[24px] rounded-[12px] bg-[#EBEDF0] hover:bg-gray-200 text-sm sm:text-[16px] font-[500] text-[#0E1011]">
            Action
            <MdKeyboardArrowDown className="text-lg" />
          </button>

          {/* Take Action */}
          <button
            onClick={() => setActionModalOpen(true)}
            className="hidden sm:flex items-center gap-2 py-[12px] px-[24px] rounded-[12px] rounded-md bg-[#EBEDF0] hover:bg-gray-200 text-sm sm:text-[16px] font-[500] text-[#0E1011]"
          >
            Take Action
          </button>

          {/* Desktop Buttons */}
          <div className="hidden md:flex items-center gap-3">
            {headerLinks.map((btn) => (
              <button
                key={btn.id}
                onClick={btn.onClick}
                className="flex items-center gap-1.5 sm:gap-2 p-2 rounded-md hover:bg-gray-100 font-[500] text-[#495057]"
              >
                <span className="text-lg">{btn.icon}</span>
                {btn.name}
              </button>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="flex md:hidden items-center p-2 rounded-md bg-gray-100 hover:bg-gray-200"
          >
            <MdMoreVert className="text-xl text-gray-700" />
          </button>

          {/* Mobile Dropdown Menu */}
          {showMobileMenu && (
            <div className="absolute top-16 left-3 right-3 bg-white border border-gray-200 rounded-lg shadow-lg p-2 flex flex-col z-50 animate-fadeIn">
              <button
                onClick={() => {
                  setActionModalOpen(true);
                  setShowMobileMenu(false);
                }}
                className="text-sm text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 text-left"
              >
                Take Action
              </button>
              {headerLinks.map((btn) => (
                <button
                  key={btn.id}
                  onClick={() => {
                    btn.onClick();
                    setShowMobileMenu(false);
                  }}
                  className="text-sm text-gray-800 px-3 py-2 rounded-md hover:bg-gray-100 text-left flex items-center gap-2"
                >
                  {btn.icon}
                  {btn.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* RIGHT SECTION */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button className="border rounded-md p-1.5 sm:p-2 hover:bg-gray-100">
            <IoIosArrowBack className="text-gray-700 text-lg" />
          </button>
          <button className="border rounded-md p-1.5 sm:p-2 hover:bg-gray-100">
            <IoIosArrowForward className="text-gray-700 text-lg" />
          </button>
          <button className="border bg-gray-100 rounded-md p-1.5 sm:p-2 hover:bg-gray-200">
            <IoCloseOutline className="text-gray-700 text-lg" />
          </button>
        </div>
      </header>

      {/* MODALS */}
      <AppointmentModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} />
      <TaskModal isOpen={isTaskModalOpen} onClose={() => setTaskModalOpen(false)} />
      <CallBackModal
        isOpen={isCallBackModalOpen}
        onClose={() => setCallBackModalOpen(false)}
      />
      <TakeActionModal
        isOpen={isActionModalOpen}
        onClose={() => setActionModalOpen(false)}
      />
    </>
  );
};

export default ContactDetailHeader;
