import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { TfiDownload } from "react-icons/tfi";

import AllContactSidebar from "@/components/agent/common/allcontactsidebar";
import Navbar from "@/components/agent/common/navbar";
import ExportFieldsModal from "@/components/modal/exportfieldmodal";

const ContactLayout = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeItem, setActiveItem] = useState("allContacts");

  // ✅ Handle responsive behavior
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 1024) {
        setIsMobile(true);
        setIsOpen(false);
      } else {
        setIsMobile(false);
        setIsOpen(true);
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="min-h-screen w-full relative">
      {/* 🔹 Sidebar (hidden on mobile unless open) */}
      {(!isMobile || isOpen) && (
        <div className={`fixed top-0 left-0 h-full z-1000 transition-transform duration-300 ease-in-out
    ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
  `}>
          <AllContactSidebar onSelectItem={setActiveItem} />
        </div>
      )}

      {/* 🔹 Mobile Toggle Icon */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 z-1100 p-1 rounded-md shadow-sm transition 
            bg-gray-100 hover:bg-gray-200 
            ${isOpen ? "left-52" : "left-4"}`}
        >
          {isOpen ? (
            <FiX size={17} className="text-gray-800" />
          ) : (
            <FiMenu size={17} className="text-gray-800" />
          )}
        </button>
      )}

      {/* 🔹 Navbar */}
      <div className="fixed z-999 top-0 w-full">
        <Navbar />
      </div>

      {/* 🔹 Main Content */}
      <div
        className={`absolute top-16 pt-4 bg-[#F7F7F7] w-full transition-all duration-300
          ${isMobile ? "pl-4" : isOpen ? "pl-72" : "pl-20"}`}
      >
        <Outlet context={{ activeItem }} />
      </div>

      {/* 🔹 Bottom Bar */}
      <div
        className={`flex w-full bottom-0 fixed bg-white shadow-2xl py-4 items-center gap-2
          ${isMobile ? "pl-4" : isOpen ? "pl-72" : "pl-20"}`}
      >
        <button
          className="flex items-center gap-2"
          onClick={() => setShowExportModal(true)}
        >
          <TfiDownload className="text-[17px] text-[#495057]" />
          <span className="text-[16px] text-[#495057] font-medium">Export</span>
        </button>
      </div>

      {/* 🔹 Export Modal */}
      {showExportModal && (
        <ExportFieldsModal onClose={() => setShowExportModal(false)} />
      )}
    </div>
  );
};

export default ContactLayout;
