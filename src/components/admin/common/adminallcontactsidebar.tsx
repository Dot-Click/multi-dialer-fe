import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { VscFolderOpened, VscFolder } from "react-icons/vsc";
import { LuArrowUpToLine } from "react-icons/lu";
import usericon from "../../../assets/admin/usericons.png";
import ImportContactModal from "../modals/ImportContactModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContacts, fetchContactFolders, fetchContactLists, createContactFolder, deleteContactFolder, createContactList, deleteContactList } from "@/store/slices/contactSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import StructureModal from "@/components/modal/StructureModal";
import toast from "react-hot-toast";

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
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  
  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    type: 'folder' | 'list';
    parentId?: string;
    title: string;
    placeholder: string;
  }>({
    isOpen: false,
    type: 'folder',
    title: "",
    placeholder: "",
  });
  
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  
  const { folders, lists, isLoading } = useAppSelector((state) => state.contacts);

  useEffect(() => {
    onSelectItem({ type: "allContacts", name: "All Contacts" });
    dispatch(fetchContactFolders());
    dispatch(fetchContactLists());
  }, [dispatch]);

  const handleImportSuccess = () => {
    dispatch(fetchContactFolders());
    dispatch(fetchContactLists());
    dispatch(fetchContacts());
  };

  const handleClick = (type: string, name: string, id?: string) => {
    const itemKey = id ? `${type}-${id}` : type;
    setActiveItem(itemKey);
    onSelectItem({ type, id, name });

    if (location.pathname !== "/admin/data-dialer") {
      navigate("/admin/data-dialer");
    }
  };

  const toggleFolder = (e: React.MouseEvent, folderId: string) => {
    e.stopPropagation();
    setExpandedFolders(prev => ({
      ...prev,
      [folderId]: !prev[folderId]
    }));
  };

  const handleCreateFolder = (parentId?: string) => {
    setModalConfig({
      isOpen: true,
      type: 'folder',
      parentId,
      title: parentId ? "Add New Subfolder" : "Add New Folder",
      placeholder: "Enter folder name",
    });
  };

  const handleCreateList = (folderId?: string) => {
    setModalConfig({
      isOpen: true,
      type: 'list',
      parentId: folderId,
      title: folderId ? "Add New List to Folder" : "Add New Calling List",
      placeholder: "Enter list name",
    });
  };

  const handleModalSave = async (name: string) => {
    if (modalConfig.type === 'folder') {
      const res = await dispatch(createContactFolder({ name, parentId: modalConfig.parentId }));
      if (createContactFolder.fulfilled.match(res)) {
        toast.success("Folder created successfully!");
        if (modalConfig.parentId) {
          setExpandedFolders(prev => ({ ...prev, [modalConfig.parentId!]: true }));
        }
      }
    } else {
      const res = await dispatch(createContactList({ name, folderId: modalConfig.parentId }));
      if (createContactList.fulfilled.match(res)) {
        toast.success("List created successfully!");
        if (modalConfig.parentId) {
          setExpandedFolders(prev => ({ ...prev, [modalConfig.parentId!]: true }));
        }
      }
    }
  };

  const handleDeleteList = (id: string, name: string) => {
     toast((t) => (
      <span className="flex flex-wrap items-center gap-2">
        Delete list <b className="text-gray-900">"{name}"</b>?
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              dispatch(deleteContactList(id));
            }}
            className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-md font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 6000 });
  };

  const handleDeleteFolder = (id: string, name: string) => {
    toast((t) => (
      <span className="flex flex-wrap items-center gap-2">
        Delete folder <b className="text-gray-900">"{name}"</b>?
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              dispatch(deleteContactFolder(id));
            }}
            className="bg-red-500 text-white text-xs px-3 py-1.5 rounded-md font-medium hover:bg-red-600 transition-colors"
          >
            Delete
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-100 text-gray-700 text-xs px-3 py-1.5 rounded-md font-medium hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
        </div>
      </span>
    ), { duration: 6000 });
  };

  useEffect(() => {
    const handleClickOutside = () => setOpenMenuId(null);
    window.addEventListener('click', handleClickOutside);
    return () => window.removeEventListener('click', handleClickOutside);
  }, []);

  const renderTree = (parentId: string | null = null, depth = 0, hideLists = false) => {
    const currentFolders = folders.filter(f => f.parentId === parentId);
    const currentLists = hideLists ? [] : lists.filter(l => l.folderId === parentId);

    return (
      <>
        {currentFolders.map(folder => (
          <div key={folder.id} className="flex flex-col">
            <div
              onClick={() => handleClick("folder", folder.name, folder.id)}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              className={`flex gap-2 items-center py-2 px-3 rounded-xl cursor-pointer transition group mb-1
                ${activeItem === `folder-${folder.id}` ? "bg-slate-100 dark:bg-slate-700/50" : "hover:bg-slate-50 dark:hover:bg-slate-700/30"}`}
            >
              <button 
                onClick={(e) => toggleFolder(e, folder.id)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition shrink-0"
              >
                {expandedFolders[folder.id] ? <IoIosArrowDown className="text-gray-400" /> : <IoIosArrowForward className="text-gray-400" />}
              </button>
              <div className="shrink-0">
                {expandedFolders[folder.id] ? (
                  <VscFolderOpened className="text-xl text-gray-600 dark:text-gray-400" />
                ) : (
                  <VscFolder className="text-xl text-gray-600 dark:text-gray-400" />
                )}
              </div>
              <span className="text-[#2B3034] dark:text-white font-semibold text-[14px] truncate flex-1">
                {folder.name}
              </span>

              <div className="relative">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === folder.id ? null : folder.id);
                  }}
                  className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition opacity-0 group-hover:opacity-100"
                >
                  <FiMoreHorizontal className="text-gray-400" />
                </button>
                {openMenuId === folder.id && (
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 shadow-xl rounded-xl py-2 z-[110] border border-gray-100 dark:border-slate-700 min-w-[140px] animate-in fade-in zoom-in duration-150">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFolder(folder.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                    >
                      <FiPlus className="text-[14px]" />
                      Add Subfolder
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateList(folder.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
                    >
                      <FiPlus className="text-[14px]" />
                      Add List
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteFolder(folder.id, folder.name);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-4 py-2.5 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
                    >
                      Delete Folder
                    </button>
                  </div>
                )}
              </div>
            </div>
            
            {expandedFolders[folder.id] && (
              <div className="flex flex-col">
                {renderTree(folder.id, depth + 1)}
              </div>
            )}
          </div>
        ))}

        {!hideLists && currentLists.map(list => (
          <div
            key={list.id}
            onClick={() => handleClick("list", list.name, list.id)}
            style={{ paddingLeft: `${depth * 12 + 28}px` }}
            className={`text-[#2B3034] dark:text-white flex justify-between items-center py-2 px-3 rounded-xl cursor-pointer transition mb-1
              ${activeItem === `list-${list.id}` ? "bg-slate-100 dark:bg-slate-700/50" : "hover:bg-slate-50 dark:hover:bg-slate-700/30"}`}
          >
            <span className="text-[#2B3034] dark:text-white font-semibold text-[13px] truncate">
              {list.name}
            </span>
            <div className="flex items-center justify-center w-7 h-7 rounded-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-800 shrink-0 ml-2 shadow-sm">
              <span className="text-[10px] font-bold text-gray-500 uppercase">
                {list.name.slice(0, 2)}
              </span>
            </div>
          </div>
        ))}
      </>
    );
  };

  const rootLists = lists.filter(l => l.folderId === null);

  return (
    <aside className="bg-white dark:bg-slate-800 flex flex-col px-4 py-4 w-64 h-screen shadow-sm border-r border-gray-100 dark:border-slate-700">
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex gap-2 items-center cursor-pointer hover:text-black dark:text-white transition mb-6"
      >
        <IoIosArrowBack className="text-xl text-gray-400" />
        <span className="text-[14px] text-gray-600 dark:text-white font-semibold">
          Back
        </span>
      </button>

      {/* All Contacts */}
      <div
        onClick={() => handleClick("allContacts", "All Contacts")}
        className={`flex gap-3 items-center px-4 py-3 rounded-xl cursor-pointer transition mb-2
          ${activeItem === "allContacts" ? "bg-slate-100 dark:bg-slate-700" : "hover:bg-slate-50 dark:hover:bg-slate-700/40"}`}
      >
        <img src={usericon} alt="usericon" className="w-5 h-5 opacity-80" />
        <h1 className="text-[#2B3034] dark:text-white font-bold text-[14px]">All Contacts</h1>
      </div>

      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="flex-1 overflow-auto custom-scrollbar flex flex-col pt-4">
          
          {/* CALLING LISTS Section */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-3 pr-2">
              <h2 className="px-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest">
                Calling Lists
              </h2>
              <button
                onClick={() => handleCreateList()}
                className="p-1.5 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
              >
                <FiPlus className="text-sm" />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {rootLists.map(list => (
                <div
                  key={list.id}
                  onClick={() => handleClick("list", list.name, list.id)}
                  className={`text-[#2B3034] dark:text-white flex justify-between items-center py-2.5 px-4 rounded-xl cursor-pointer transition mb-1
                    ${activeItem === `list-${list.id}` ? "bg-slate-100 dark:bg-slate-700/50" : "hover:bg-slate-50 dark:hover:bg-slate-700/30"}`}
                >
                  <span className="text-[#2B3034] dark:text-white font-semibold text-[14px] truncate">
                    {list.name}
                  </span>
                  <div className="flex items-center justify-center w-8 h-8 rounded-full border border-gray-100 dark:border-slate-600 bg-white dark:bg-slate-800 shrink-0 ml-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase">
                      {list.name.slice(0, 2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <hr className="mb-6 border-gray-50 dark:border-slate-700 mx-2" />

          {/* FOLDERS Section */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-3 pr-2">
              <h2 className="px-4 text-[12px] font-bold text-gray-400 uppercase tracking-widest ">
                Folders
              </h2>
              <button
                onClick={() => handleCreateFolder()}
                className="p-1.5 bg-slate-50 dark:bg-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-600 rounded-lg transition-colors text-gray-500 dark:text-gray-400"
              >
                <FiPlus className="text-sm" />
              </button>
            </div>
            <div className="flex flex-col gap-0.5">
              {renderTree(null, 0, true)}
              
              {!isLoading && folders.length === 0 && (
                <div className="flex flex-col items-center justify-center py-10 opacity-30">
                   <VscFolder className="text-3xl mb-2" />
                   <span className="text-[11px] font-medium italic">Create a folder to get started</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-auto pt-4">
        <button
          onClick={() => setIsImportModalOpen(true)}
          className="w-full text-sm flex items-center justify-center gap-2 py-3 bg-[#F0F2F4] dark:bg-slate-700/50 hover:bg-[#E2E8F0] dark:hover:bg-slate-600 transition-all text-[#2B3034] dark:text-white font-bold rounded-xl"
        >
          <LuArrowUpToLine className="text-xl" />
          <span>Import File</span>
        </button>

        <ImportContactModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={handleImportSuccess}
        />
      </div>

      <StructureModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onSave={handleModalSave}
        title={modalConfig.title}
        placeholder={modalConfig.placeholder}
      />
    </aside>
  );
};

export default AdminAllContactSidebar;
