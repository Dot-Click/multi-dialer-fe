import { useState, useEffect } from "react";
import { IoIosArrowBack } from "react-icons/io";
import { VscFolderOpened } from "react-icons/vsc";
import { LuArrowUpToLine } from "react-icons/lu";
import usericon from "../../../assets/admin/usericons.png";
import ImportContactModal from "../modals/ImportContactModal";
import {
  useContact,
  type ContactList,
  type ContactFolder,
} from "@/hooks/useContact";
import { useAppDispatch } from "@/store/hooks";
import { fetchContacts } from "@/store/slices/contactSlice";
import { useNavigate, useLocation } from "react-router-dom"

interface AllContactSidebarProps {
  onSelectItem: (selection: {
    type: string;
    id?: string;
    name: string;
  }) => void;
}

const AdminAllContactSidebar: React.FC<AllContactSidebarProps> = ({
  onSelectItem,
}) => {
  const [activeItem, setActiveItem] = useState("allContacts");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const location = useLocation();

  const navigate = useNavigate();


  const { getContactLists, getContactFolders, loading } =
    useContact();
  const dispatch = useAppDispatch();

  const [folders, setFolders] = useState<ContactFolder[]>([]);
  const [lists, setLists] = useState<ContactList[]>([]);

  const fetchData = async () => {
    const [allLists, allFolders] = await Promise.all([
      getContactLists(),
      getContactFolders(),
    ]);

    setFolders(allFolders);
    setLists(allLists);
  };

  // ✅ Back button logic
  // let backTo = "/";
  // if (location.pathname === "/admin/data-dialer") {
  //   backTo = "/admin";
  // } else if (location.pathname === "/data-dialer") {
  //   backTo = "/";
  // }

  useEffect(() => {
    onSelectItem({ type: "allContacts", name: "All Contacts" });
    fetchData();
  }, []);

  const handleImportSuccess = () => {
    fetchData(); // Refresh sidebar lists/groups
    dispatch(fetchContacts()); // Refresh the main contacts table (Redux)
  };

  const handleClick = (type: string, name: string, id?: string) => {
    const itemKey = id ? `${type}-${id}` : type;
    setActiveItem(itemKey);
    onSelectItem({ type, id, name });

    // Navigate back to data-dialer if we're on find-duplicates or other admin contact subpages
    if (location.pathname !== "/admin/data-dialer") {
      navigate("/admin/data-dialer");
    }
  };

  // ✅ Handle Import Modal
  const openImportModal = () => {
    setIsImportModalOpen(true);
  };

  return (
    <aside className="bg-white dark:bg-slate-800 flex flex-col px-5 py-4 w-64 h-screen shadow-sm">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex gap-2 items-center cursor-pointer hover:text-[#FFCA06] dark:text-white transition"
      >
        <IoIosArrowBack className="text-2xl" />
        <span className="text-[16px] text-[#495057] dark:text-white font-medium">
          Back
        </span>
      </button>

      <div className="border-b border-gray-100 h-1 my-3"></div>

      {/* All Contacts */}
      <div
        onClick={() => handleClick("allContacts", "All Contacts")}
        className={`flex gap-2 items-center px-2 py-2 rounded-md cursor-pointer transition 
          ${activeItem === "allContacts" ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
      >
        <img src={usericon} alt="usericon" className="w-6 h-6" />
        <h1 className="text-[#495057] dark:text-white font-medium text-[14px]">All Contacts</h1>
      </div>

      <div className="border-b border-gray-100 h-1 my-3"></div>

      {/* Calling Lists */}
      <div className="flex flex-col gap-2 overflow-hidden">
        <h1 className="text-[#495057] dark:text-white font-medium uppercase text-[14px]">
          Calling Lists
        </h1>
        <div className="flex gap-2 h-[40vh] px-1.5 overflow-auto custom-scrollbar flex-col">
          {lists.map((list) => (
            <div
              key={list.id}
              onClick={() => handleClick("list", list.name, list.id)}
              className={`text-[#495057] dark:text-white flex justify-between items-center px-2 py-1 rounded-md cursor-pointer transition
                ${activeItem === `list-${list.id}` ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
            >
              <h1 className="text-[#495057] dark:text-white font-medium text-[14px] truncate">
                {list.name}
              </h1>
              <h1 className="border border-gray-200 dark:border-slate-600 rounded-full text-[12px] px-2 py-1.5 uppercase whitespace-nowrap">
                {list.name.slice(0, 2)}
              </h1>
            </div>
          ))}

          {!loading && lists.length === 0 && (
            <span className="text-xs text-gray-400 text-center py-4">
              No lists found
            </span>
          )}
        </div>
      </div>

      <div className="border-b border-gray-100 h-1 my-3"></div>

      {/* Folders */}
      <div className="flex flex-col gap-2 overflow-hidden">
        <h1 className="text-[#495057] dark:text-white uppercase font-medium text-[14px]">
          Folders
        </h1>
        <div className="flex gap-2 h-[30vh] px-1.5 overflow-auto custom-scrollbar flex-col">
          {folders.map((folder) => (
            <div
              key={folder.id}
              onClick={() => handleClick("folder", folder.name, folder.id)}
              className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
                ${activeItem === `folder-${folder.id}` ? "bg-[#FFCA06]" : "bg-gray-50 dark:bg-gray-700 hover:bg-[#FFCA06]"}`}
            >
              <VscFolderOpened className="text-lg" />
              <h1 className="text-[#495057] dark:text-white font-medium text-[14px] truncate">
                {folder.name}
              </h1>
            </div>
          ))}
          {!loading && folders.length === 0 && (
            <span className="text-xs text-gray-400 text-center py-4">
              No folders found
            </span>
          )}
        </div>
      </div>

      <div className="mt-auto pt-2">
        <button
          onClick={openImportModal}
          className="w-full text-sm flex items-center justify-center gap-2 py-2 bg-[#EBEDF0] dark:bg-gray-700 hover:bg-[#EBE1F0] text-[#0E1011] dark:text-white font-medium rounded-md transition"
        >
          <LuArrowUpToLine className="text-base" />
          Import File
        </button>

        <ImportContactModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={handleImportSuccess}
        />
      </div>
    </aside>
  );
};

export default AdminAllContactSidebar;
