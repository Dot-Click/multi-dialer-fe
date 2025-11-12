import { useEffect, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { TfiDownload } from "react-icons/tfi";
import movetoicon from "../../assets/movetoicon.png"
import duplicatesicon from "../../assets/duplicatesicon.png"
import Navbar from "@/components/agent/common/navbar";
import ExportFieldsModal from "@/components/modal/exportfieldmodal";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import AdminAllContactSidebar from "@/components/admin/common/adminallcontactsidebar";


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
        <div className={`fixed top-0 left-0 h-full z-[1000] transition-transform duration-300 ease-in-out
    ${isMobile ? (isOpen ? "translate-x-0" : "-translate-x-full") : "translate-x-0"}
  `}>
          <AdminAllContactSidebar onSelectItem={setActiveItem} />
        </div>
      )}

      {/* 🔹 Mobile Toggle Icon */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 z-[1100] p-1 rounded-md shadow-sm transition 
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
      <div className="fixed z-[999] top-0 w-full">
        <Navbar />
      </div>

      {/* 🔹 Main Content */}
      <div
        className={`absolute top-16 pt-[1rem] bg-[#F7F7F7] w-full transition-all duration-300
          ${isMobile ? "pl-4" : isOpen ? "pl-72" : "pl-20"}`}
      >
        <Outlet context={{ activeItem }} />
      </div>

      {/* 🔹 Bottom Bar */}
      <div
        className={`flex w-full gap-7 bottom-0 fixed bg-white shadow-2xl py-4 items-center
          ${isMobile ? "pl-4" : isOpen ? "pl-72" : "pl-20"}`}
      >
        <button
          className="flex items-center gap-2"
          onClick={() => setShowExportModal(true)}
        >
          <img src={movetoicon} className="w-4" alt="movetoicon" />
          <span className="text-[14px] text-[#495057] font-[500]">Move To</span>
          <span className="text-sm text-gray-700"><FaChevronUp /></span>
        </button>

        <button
          className="flex items-center gap-2"
          onClick={() => setShowExportModal(true)}
        >
          <TfiDownload className="text-[17px] text-[#495057]" />
          <span className="text-[14px] text-[#495057] font-[500]">Export</span>
        </button>

        <Link
          className="flex items-center gap-2"
          to="/admin/find-duplicate"
        >
          <img src={duplicatesicon} className="w-4" alt="duplicatesicon" />
          <span className="text-[14px] text-[#495057] font-[500]">Find Duplicates</span>
          <span className="text-sm text-gray-700"><FaChevronDown /></span>
        </Link>


        <button
          className="flex items-center gap-2"
          onClick={() => setShowExportModal(true)}
        >
          <span className="text-[14px] text-[#D43435] font-[500]">Delete</span>
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
