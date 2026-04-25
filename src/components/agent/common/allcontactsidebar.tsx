import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import usericon from "@/assets/admin/usericons.png";
import { VscFolderOpened } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFolders, fetchLists, fetchGroups, createFolder, deleteFolder, createList, type ContactList } from "@/store/slices/contactStructureSlice";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import StructureModal from "@/components/modal/StructureModal";
import toast from "react-hot-toast";

interface SelectionItem {
  type: string;
  id?: string;
  name: string;
}

interface AllContactSidebarProps {
  onSelectItem: (selection: SelectionItem) => void;
}

const AllContactSidebar: React.FC<AllContactSidebarProps> = ({ onSelectItem }) => {
  const [activeItem, setActiveItem] = useState("allContacts");
  const [expandedFolders, setExpandedFolders] = useState<Record<string, boolean>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const dispatch = useAppDispatch();
  const { folders, lists } = useAppSelector((state) => state.contactStructure);
  
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

  const navigate = useNavigate();

  // ✅ Back button logic
  // let backTo = "/";
  // if (location.pathname === "/admin/data-dialer") {
  //   backTo = "/admin";
  // } else if (location.pathname === "/data-dialer") {
  //   backTo = "/";
  // }

  useEffect(() => {
    dispatch(fetchFolders());
    dispatch(fetchLists());
    dispatch(fetchGroups());
  }, [dispatch]);

  const handleClick = (type: string, name: string, id?: string) => {
    const itemKey = id ? `${type}-${id}` : type;
    setActiveItem(itemKey);
    onSelectItem({ type, id, name });
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
      const res = await dispatch(createFolder({ name, parentId: modalConfig.parentId }));
      if (createFolder.fulfilled.match(res)) {
        toast.success("Folder created successfully!");
        if (modalConfig.parentId) {
          setExpandedFolders(prev => ({ ...prev, [modalConfig.parentId!]: true }));
        }
      }
    } else {
      const res = await dispatch(createList({ name, folderId: modalConfig.parentId }));
      if (createList.fulfilled.match(res)) {
        toast.success("List created successfully!");
        if (modalConfig.parentId) {
          setExpandedFolders(prev => ({ ...prev, [modalConfig.parentId!]: true }));
        }
      }
    }
  };



  const handleDeleteFolder = (id: string, name: string) => {
    toast((t) => (
      <span className="flex flex-wrap items-center gap-2">
        Delete folder <b className="text-gray-900">"{name}"</b>?
        <div className="flex gap-2 ml-auto">
          <button
            onClick={() => {
              toast.dismiss(t.id);
              dispatch(deleteFolder(id));
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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const renderTree = (parentId: string | null = null, depth = 0) => {
    const currentFolders = folders.filter(f => f.parentId === parentId);
    // Only show lists inside folders. Standalone lists are in the Calling Lists section.
    const currentLists = parentId ? lists.filter(l => l.folderId === parentId) : [];

    return (
      <>
        {currentFolders.map(folder => (
          <div key={folder.id} className="flex flex-col">
            <div
              onClick={() => handleClick("folder", folder.name, folder.id)}
              style={{ paddingLeft: `${depth * 12 + 8}px` }}
              className={`flex gap-2 items-center py-2 px-2 rounded-md cursor-pointer transition group mb-1
                ${activeItem === `folder-${folder.id}` ? "bg-[#FFCA06] font-semibold text-gray-900 shadow-sm" : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"}`}
            >
              <button 
                onClick={(e) => toggleFolder(e, folder.id)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition shrink-0"
              >
                {expandedFolders[folder.id] ? <IoIosArrowDown className="text-gray-400" /> : <IoIosArrowForward className="text-gray-400" />}
              </button>
              
              <VscFolderOpened className="text-lg shrink-0" />
              
              <span className="text-[12px] font-medium truncate flex-1">
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
                  <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 shadow-xl rounded-md py-1.5 z-[110] border border-gray-100 dark:border-slate-700 min-w-[140px] ">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCreateFolder(folder.id);
                        setOpenMenuId(null);
                      }}
                      className="w-full text-left px-3 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
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
                      className="w-full text-left px-3 py-2 text-[13px] text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex items-center gap-2"
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
                      className="w-full text-left px-3 py-2 text-[13px] text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10 transition-colors flex items-center gap-2"
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

        {currentLists.map(list => (
          <div
            key={list.id}
            onClick={() => handleClick("list", list.name, list.id)}
            style={{ paddingLeft: `${depth * 12 + 28}px` }}
            className={`flex justify-between items-center py-2 px-2 rounded-md cursor-pointer transition mb-1
              ${activeItem === `list-${list.id}` ? "bg-[#FFCA06] font-semibold text-gray-900 shadow-sm" : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"}`}
          >
            <span className="font-medium text-[12px] truncate">
              {list.name}
            </span>
            <div className="h-5 w-5 rounded-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 ml-2">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">
                {getInitials(list.name)}
              </span>
            </div>
          </div>
        ))}
      </>
    );
  };

  // Find lists that don't belong to any folder
  // const folderListIds = new Set(folders.flatMap(f => f.listIds || []));
  // const standaloneLists = lists.filter(list => !folderListIds.has(list.id));
  const { mode } = useAppSelector((state) => state.theme);

  return (
    <aside className="fixed top-0 left-0 h-screen bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 flex flex-col w-64 z-40">
      
      {/* logo */}
      <div className="px-3 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <img
            src={mode === "dark" ? "/images/darkLogo.png" : "/images/logo.png"}
            alt="Logo"
            className="object-contain w-36 transition-all duration-300"
          />
        </div>

        {/* ✅ Updated Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex gap-2 items-center cursor-pointer text-gray-600 dark:text-slate-300 hover:text-[#FFCA06] transition-all px-2"
        >
          <IoIosArrowBack className="text-xl" />
          <span className="text-[12px] font-medium">
            Back
          </span>
        </button>

        <div className="border-t border-gray-200 dark:border-slate-800"></div>

        {/* All Contacts */}
        <div
          onClick={() => handleClick("allContacts", "All Contacts")}
          className={`flex gap-2 items-center px-2 py-2 rounded-md cursor-pointer transition-all duration-200
            ${activeItem === "allContacts" ? "bg-[#FFCA06] font-semibold text-gray-900 shadow-sm" : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"}`}
        >
          <img src={usericon} alt="usericon" className="w-4 h-4 dark:invert" />
          <h1 className="text-[12px] font-medium">All Contacts</h1>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-800"></div>

        {/* Calling Lists */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-2 text-gray-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">
            <span>Calling Lists</span>
            <button
              onClick={() => handleCreateList()}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <FiPlus size={14} />
            </button>
          </div>
          <div className="flex gap-1 h-[35vh] px-1 overflow-y-auto custom-scrollbar flex-col">
            {lists.map((list: ContactList) => (
              <div
                key={list.id}
                onClick={() => handleClick("list", list.name, list.id)}
                className={`flex justify-between items-center px-2 py-2 rounded-md cursor-pointer transition-all duration-200
                  ${activeItem === `list-${list.id}` ? "bg-[#FFCA06] font-semibold text-gray-900 shadow-sm" : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"}`}
              >
                <h1 className="text-[12px] font-medium truncate flex-1">{list.name}</h1>
                <div className="h-5 w-5 rounded-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 ml-2 shadow-inner">
                  <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">
                    {getInitials(list.name)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Folders */}
        <div className="flex flex-col gap-2">
          <div className="flex justify-between items-center px-2 text-gray-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider">
            <span>Folders</span>
            <button
              onClick={() => handleCreateFolder()}
              className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
            >
              <FiPlus size={14} />
            </button>
          </div>
          <div className="flex gap-1 h-[25vh] px-1 overflow-y-auto custom-scrollbar flex-col">
            {renderTree(null, 0)}
            
            {folders.length === 0 && (
              <div className="text-center py-4 opacity-40 text-[10px] font-bold uppercase tracking-widest italic">
                Empty
              </div>
            )}
          </div>
        </div>
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

export default AllContactSidebar;
