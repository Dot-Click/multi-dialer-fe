import { useEffect, useState } from "react";
import { Link, Outlet, useLocation } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import { TfiDownload } from "react-icons/tfi";
import movetoicon from "../../assets/movetoicon.png";
import duplicatesicon from "../../assets/duplicatesicon.png";
import AdminNavbar from "@/components/admin/common/adminnavbar";
import ExportFieldsModal from "@/components/modal/exportfieldmodal";
import { FaChevronUp } from "react-icons/fa6";
import { FaChevronDown } from "react-icons/fa";
import AdminAllContactSidebar from "@/components/admin/common/adminallcontactsidebar";
import { TbInfoTriangle } from "react-icons/tb";
import { bulkDeleteContacts } from "@/store/slices/contactSlice";
import toast from "react-hot-toast";
import { useAppDispatch } from "@/store/hooks";
import MoveToModal from "@/components/modal/movetomodal";

const ContactLayout = () => {
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [activeItem, setActiveItem] = useState<{
    type: string;
    id?: string;
    name: string;
  }>({
    type: "allContacts",
    name: "All Contacts",
  });
  const [selectedContacts, setSelectedContacts] = useState<any[]>([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showMoveToModal, setShowMoveToModal] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();

  useEffect(() => {
    if (location.state?.activeItem) {
      setActiveItem(location.state.activeItem);
    }
  }, [location.state]);

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

  // ✅ Delete handler
  const handleConfirmDelete = async () => {
    setLoading(true);
    if (!selectedContacts || selectedContacts.length === 0) {
      toast.error("Please select a contact to delete");
      setLoading(false);
      setShowDeleteModal(false);
      return;
    }
    try {
      const contactIds = selectedContacts.map(c => c.id).filter(Boolean);
      
      const payload = {
        contactIds,
        folderId: activeItem.type === "folder" ? activeItem.id : undefined,
        listId: activeItem.type === "list" ? activeItem.id : undefined,
        hardDelete: false
      };

      await dispatch(bulkDeleteContacts(payload)).unwrap();
      
      const successMsg = activeItem.type === "folder" 
        ? "Contact(s) removed from folder successfully" 
        : "Contact(s) deleted successfully";
        
      toast.success(successMsg);
      setSelectedContacts([]);
      setShowDeleteModal(false);
    } catch (error: any) {
      setLoading(false);
      toast.error(error || "Failed to delete contact(s)");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
    }
  };

  return (
    <div className="min-h-screen w-full relative">
      {/* 🔹 Sidebar (hidden on mobile unless open) */}
      {(!isMobile || isOpen) && (
        <div
          className={`fixed top-0 left-0 h-full z-1000 transition-transform duration-300 ease-in-out
            ${isMobile
              ? isOpen
                ? "translate-x-0"
                : "-translate-x-full"
              : "translate-x-0"
            }
          `}
        >
          <AdminAllContactSidebar onSelectItem={setActiveItem} />
        </div>
      )}

      {/* 🔹 Mobile Toggle Icon */}
      {isMobile && (
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`fixed top-4 z-1100 p-1 rounded-md shadow-sm transition 
            bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 
            ${isOpen ? "left-52" : "left-4"}`}
        >
          {isOpen ? (
            <FiX size={17} className="text-gray-800 dark:text-white" />
          ) : (
            <FiMenu size={17} className="text-gray-800 dark:text-white" />
          )}
        </button>
      )}

      {/* 🔹 Navbar */}
      <div className="fixed z-999 top-0 w-full">
        <AdminNavbar />
      </div>

      {/* 🔹 Main Content */}
      <div
        className={`absolute top-16 pt-4  transition-all duration-300
          ${isMobile
            ? "left-0 pl-4 w-full"
            : isOpen
              ? "left-72 w-[calc(100%-18rem)]"
              : "left-20 w-[calc(100%-5rem)]"
          }`}
      >
        <Outlet context={{ activeItem, selectedContacts, setSelectedContacts }} />
      </div>

      {/* 🔹 Bottom Bar */}
      <div
        className={`flex gap-6 bottom-0 fixed bg-white dark:bg-slate-900 border-t border-gray-100 dark:border-slate-800 shadow-[0_-8px_30px_rgb(0,0,0,0.08)] py-3 items-center transition-all duration-300 z-[90]
          ${isMobile
            ? "left-0 pl-4 w-full"
            : isOpen
              ? "left-64 w-[calc(100%-16rem)] px-8"
              : "left-20 w-[calc(100%-5rem)] px-8"
          }`}
      >
        <button
          className={`flex items-center gap-1.5 group ${selectedContacts.length === 0 ? "opacity-40 cursor-not-allowed" : "hover:opacity-80"}`}
          onClick={() => {
            if (selectedContacts.length > 0) {
              setShowMoveToModal(true);
            } else {
              toast.error("Please select a contact to move");
            }
          }}
          disabled={selectedContacts.length === 0}
        >
          <img src={movetoicon} className="w-3.5 grayscale brightness-50 group-hover:grayscale-0 dark:invert" alt="movetoicon" />
          <span className="text-[11px] text-[#495057] dark:text-slate-300 font-bold uppercase tracking-wider">Move To</span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500">
            <FaChevronUp />
          </span>
        </button>

        <button
          className="flex items-center gap-1.5 hover:opacity-80 group"
          onClick={() => setShowExportModal(true)}
        >
          <TfiDownload className="text-[14px] text-gray-500 group-hover:text-[#495057] dark:text-slate-400" />
          <span className="text-[11px] text-[#495057] dark:text-slate-300 font-bold uppercase tracking-wider">Export</span>
        </button>

        <Link className="flex items-center gap-1.5 hover:opacity-80" to="/admin/find-duplicate">
          <img src={duplicatesicon} className="w-3.5 grayscale brightness-50 dark:invert" alt="duplicatesicon" />
          <span className="text-[11px] text-[#495057] dark:text-slate-300 font-bold uppercase tracking-wider">
            Find Duplicates
          </span>
          <span className="text-[10px] text-gray-400 dark:text-slate-500">
            <FaChevronDown />
          </span>
        </Link>

        {/* Delete Button */}
        <button
          className="flex items-center gap-1.5 hover:opacity-80 ml-auto"
          onClick={() => setShowDeleteModal(true)}
        >
          <span className="text-[11px] text-[#D43435] font-bold uppercase tracking-wider">Delete Selected</span>
        </button>
      </div>

      {/* 🔹 Export Modal */}
      {showExportModal && (
        <ExportFieldsModal
          onClose={() => setShowExportModal(false)}
          activeItem={activeItem}
        />
      )}

      {/* 🔹 Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-2000">
          <div className="bg-white dark:bg-slate-800 w-[380px] rounded-xl shadow-lg p-6 text-center relative">
            {/* Warning Icon */}
            <div className="text-red-500 flex justify-center text-4xl mb-3">
              <TbInfoTriangle />
            </div>
            <h2 className="text-lg font-medium mb-1 dark:text-white">
              {activeItem.type === "folder" ? "Remove from Folder?" : "Delete Lead?"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-5">
              {activeItem.type === "folder" 
                ? `This will remove the selected leads from the "${activeItem.name}" folder. They will remain in your database.`
                : "Once deleted, this action cannot be undone. Are you sure you want to proceed?"}
            </p>

            {/* Buttons */}
            <div className="flex justify-center gap-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-white font-medium px-5 py-2 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={() => handleConfirmDelete()}
                className="bg-[#FFCA06] w-full hover:bg-[#ffd633] text-[#2B3034] font-semibold px-5 py-2 rounded-lg"
              >
                {loading ? "Processing..." : activeItem.type === "folder" ? "Yes, Remove" : "Yes, Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🔹 Move To Modal */}
      <MoveToModal
        isOpen={showMoveToModal}
        onClose={() => setShowMoveToModal(false)}
        selectedContacts={selectedContacts}
      />
    </div>
  );
};

export default ContactLayout;
