


import AllContactSidebar from "@/components/agent/common/allcontactsidebar";
import Navbar from "@/components/agent/common/navbar";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { TfiDownload } from "react-icons/tfi";
import ExportFieldsModal from "@/components/modal/exportfieldmodal";

const ContactLayout = () => {
  const [isOpen] = useState(true);
  const [isMobile] = useState(false);
  const [showExportModal, setshowExportModal] = useState(false);
  const [activeItem, setActiveItem] = useState("allContacts");

  return (
    <div className="min-h-screen w-full relative">
      <div className="fixed top-0 z-[1000]">
        <AllContactSidebar onSelectItem={setActiveItem} />
      </div>

      <div className="fixed z-[999] top-0 w-full">
        <Navbar />
      </div>

      <div
        className={`absolute top-16 pt-[1rem] bg-[#EBEDF0] w-full transition-all duration-300
          ${isMobile ? "pl-4" : isOpen ? "pl-72" : "pl-20"}`}
      >
        <Outlet context={{ activeItem }} />
      </div>

      <div
        className={`flex w-full bottom-0 fixed bg-white shadow-2xl py-4 items-center gap-2
          ${isMobile ? "pl-4" : isOpen ? "pl-72" : "pl-20"}`}
      >
        <button
          className="flex items-center gap-2"
          onClick={() => setshowExportModal(true)}
        >
          <span>
            <TfiDownload className="text-[17px] text-[#495057]" />
          </span>
          <span className="text-[16px] text-[#495057] font-[500]">Export</span>
        </button>
      </div>

      {showExportModal && (
        <ExportFieldsModal onClose={() => setshowExportModal(false)} />
      )}
    </div>
  );
};

export default ContactLayout;
