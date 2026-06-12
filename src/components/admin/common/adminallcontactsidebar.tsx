import { useState, useEffect } from "react";
import { IoIosArrowBack, IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { VscFolderOpened } from "react-icons/vsc";
import { LuArrowUpToLine, LuCornerDownRight } from "react-icons/lu";
import usericon from "@/assets/admin/usericons.png";
import ImportContactModal from "../modals/ImportContactModal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchContacts, fetchContactFolders, fetchContactLists, createContactFolder, deleteContactFolder, createContactList, updateContactList, deleteContactList } from "@/store/slices/contactSlice";
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
  const [expandedLists, setExpandedLists] = useState<Record<string, boolean>>({});
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    // folder: new folder/subfolder · list: new list in folder · sublist: child of a list · rename-list: rename existing list
    type: 'folder' | 'list' | 'sublist' | 'rename-list';
    parentId?: string;      // folder parentId (subfolder) OR folderId (list-in-folder)
    listParentId?: string;  // parent LIST id (for sublist creation)
    editId?: string;        // list id being renamed
    defaultValue?: string;  // pre-filled value (rename)
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

  const toggleList = (e: React.MouseEvent, listId: string) => {
    e.stopPropagation();
    setExpandedLists(prev => ({ ...prev, [listId]: !prev[listId] }));
  };

  const handleCreateSubList = (parentListId: string) => {
    setModalConfig({
      isOpen: true,
      type: 'sublist',
      listParentId: parentListId,
      title: "Add New Sub-list",
      placeholder: "Enter sub-list name",
    });
  };

  const handleRenameList = (list: { id: string; name: string }) => {
    setModalConfig({
      isOpen: true,
      type: 'rename-list',
      editId: list.id,
      defaultValue: list.name,
      title: "Rename List",
      placeholder: "Enter new name",
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
    } else if (modalConfig.type === 'sublist') {
      const res = await dispatch(createContactList({ name, parentId: modalConfig.listParentId }));
      if (createContactList.fulfilled.match(res)) {
        toast.success("Sub-list created successfully!");
        if (modalConfig.listParentId) {
          setExpandedLists(prev => ({ ...prev, [modalConfig.listParentId!]: true }));
        }
      } else {
        toast.error((res.payload as string) || "Failed to create sub-list");
      }
    } else if (modalConfig.type === 'rename-list') {
      if (!modalConfig.editId) return;
      const res = await dispatch(updateContactList({ id: modalConfig.editId, payload: { name } }));
      if (updateContactList.fulfilled.match(res)) {
        toast.success("List renamed successfully!");
      } else {
        toast.error((res.payload as string) || "Failed to rename list");
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
    const childCount = lists.filter(l => l.parentId === id).length;
    const warning = childCount > 0
      ? ` and its ${childCount} sub-list${childCount === 1 ? '' : 's'}`
      : '';
    toast((t) => (
      <span className="flex flex-wrap items-center gap-2">
        Delete list <b className="text-gray-900">"{name}"</b>{warning}?
        <div className="flex gap-2 ml-auto">
          <button
            onClick={async () => {
              toast.dismiss(t.id);
              const res = await dispatch(deleteContactList(id));
              if (deleteContactList.fulfilled.match(res)) {
                toast.success("List deleted");
              } else {
                toast.error((res.payload as string) || "Failed to delete list");
              }
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
              className={`flex gap-2 items-center py-2 px-3 rounded-md cursor-pointer transition group mb-1
                ${activeItem === `folder-${folder.id}` ? "bg-[#FFCA06] font-semibold text-gray-900 shadow-sm" : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"}`}
            >
              <button 
                onClick={(e) => toggleFolder(e, folder.id)}
                className="p-1 hover:bg-black/5 dark:hover:bg-white/5 rounded-md transition shrink-0"
              >
                {expandedFolders[folder.id] ? <IoIosArrowDown className="text-gray-400" /> : <IoIosArrowForward className="text-gray-400" />}
              </button>
              <div className="shrink-0">
                <VscFolderOpened className="text-lg" />
              </div>
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
            className={`flex justify-between items-center py-2 px-2 rounded-md cursor-pointer transition mb-1
              ${activeItem === `list-${list.id}` ? "bg-[#FFCA06] font-semibold text-gray-900 shadow-sm" : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"}`}
          >
            <span className="font-medium text-[12px] truncate">
              {list.name}
            </span>
            <div className="h-5 w-5 rounded-full border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 flex items-center justify-center shrink-0 ml-2 shadow-inner">
              <span className="text-[8px] font-black text-gray-500 uppercase tracking-tighter">
                {list.name.slice(0, 2)}
              </span>
            </div>
          </div>
        ))}
      </>
    );
  };

  // Top-level calling lists: not in a folder and not a sub-list.
  const rootLists = lists.filter(l => l.folderId == null && !l.parentId);

  // Renders a calling list row plus (for top-level lists) its sub-lists.
  const renderCallingListItem = (list: { id: string; name: string }, isSub: boolean) => {
    const subs = isSub ? [] : lists.filter(l => l.parentId === list.id);
    const hasSubs = subs.length > 0;
    const expanded = !!expandedLists[list.id];

    const menuItemBase = "w-full text-left px-4 py-2.5 text-[13px] transition-colors flex items-center gap-2";

    const isActive = activeItem === `list-${list.id}`;

    return (
      <div key={list.id} className="flex flex-col">
        <div
          onClick={() => handleClick("list", list.name, list.id)}
          className={`group flex justify-between items-center rounded-md cursor-pointer transition-all duration-200
            ${isSub ? "py-1.5 px-2" : "py-2 px-2"}
            ${isActive
              ? "bg-[#FFCA06] font-semibold text-gray-900 shadow-sm"
              : isSub
                ? "hover:bg-[#FFCA06]/40 text-gray-500 dark:text-slate-400"
                : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"}`}
        >
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            {!isSub ? (
              <button
                onClick={(e) => (hasSubs ? toggleList(e, list.id) : e.stopPropagation())}
                className={`p-0.5 rounded transition shrink-0 ${hasSubs ? "hover:bg-black/5 dark:hover:bg-white/5" : "opacity-0 pointer-events-none"}`}
              >
                {expanded ? <IoIosArrowDown className="text-gray-400 text-xs" /> : <IoIosArrowForward className="text-gray-400 text-xs" />}
              </button>
            ) : (
              <LuCornerDownRight className={`text-xs shrink-0 ${isActive ? "text-gray-700" : "text-gray-300 dark:text-slate-600"}`} />
            )}
            <span className={`truncate ${isSub ? "text-[11px] font-normal" : "text-[12px] font-semibold"}`}>
              {list.name}
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 ml-2">
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenMenuId(openMenuId === list.id ? null : list.id);
                }}
                className="p-1 hover:bg-black/10 dark:hover:bg-white/10 rounded-md transition opacity-0 group-hover:opacity-100"
              >
                <FiMoreHorizontal className="text-gray-500" />
              </button>
              {openMenuId === list.id && (
                <div className="absolute top-full right-0 mt-1 bg-white dark:bg-slate-800 shadow-xl rounded-xl py-2 z-[110] border border-gray-100 dark:border-slate-700 min-w-[150px] animate-in fade-in zoom-in duration-150">
                  {!isSub && (
                    <button
                      onClick={(e) => { e.stopPropagation(); handleCreateSubList(list.id); setOpenMenuId(null); }}
                      className={`${menuItemBase} text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-700/50`}
                    >
                      <FiPlus className="text-[14px]" />
                      Add Sub-list
                    </button>
                  )}
                  <button
                    onClick={(e) => { e.stopPropagation(); handleRenameList(list); setOpenMenuId(null); }}
                    className={`${menuItemBase} text-gray-700 dark:text-gray-300 hover:bg-slate-50 dark:hover:bg-slate-700/50`}
                  >
                    Rename
                  </button>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleDeleteList(list.id, list.name); setOpenMenuId(null); }}
                    className={`${menuItemBase} text-red-500 hover:bg-red-50 dark:hover:bg-red-900/10`}
                  >
                    Delete List
                  </button>
                </div>
              )}
            </div>
            <div className={`rounded-full border flex items-center justify-center shadow-inner shrink-0
              ${isSub
                ? "h-4 w-4 border-gray-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-800"
                : "h-5 w-5 border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900"}`}>
              <span className={`font-black text-gray-500 uppercase tracking-tighter ${isSub ? "text-[6px]" : "text-[8px]"}`}>
                {list.name.slice(0, 2)}
              </span>
            </div>
          </div>
        </div>

        {!isSub && expanded && hasSubs && (
          <div className="ml-3 pl-3 mt-0.5 flex flex-col gap-0.5 border-l-2 border-gray-200 dark:border-slate-700">
            {subs.map(s => renderCallingListItem(s, true))}
          </div>
        )}
      </div>
    );
  };

  const { mode } = useAppSelector((state) => state.theme);

  return (
    <aside className="fixed top-0 left-0 px-4 pb-4 h-screen bg-white dark:bg-slate-950 border-r border-gray-200 dark:border-slate-800 flex flex-col w-64 z-40">
      
      {/* logo */}
      <div className="px-3 py-4 flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <img
            src={mode === "dark" ? "/images/darkLogo.png" : "/images/logo.png"}
            alt="Logo"
            loading="lazy"
            onClick={() => navigate("/admin")}
            className="object-contain w-36 transition-all duration-300 cursor-pointer hover:opacity-80"
          />
        </div>
      </div>
    
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex gap-2 items-center cursor-pointer text-gray-600 dark:text-slate-300 hover:text-[#FFCA06] transition-all px-2"
        >
          <IoIosArrowBack className="text-xl" />
          <span className="text-[12px] font-medium">
            Back
          </span>
        </button>

        <div className="border-t border-gray-200 dark:border-slate-800 mt-4"></div>

        {/* All Contacts */}
        <div
          onClick={() => handleClick("allContacts", "All Contacts")}
          className={`flex gap-2 items-center mt-4 px-2 py-2 rounded-md cursor-pointer transition-all duration-200
            ${activeItem === "allContacts" ? "bg-[#FFCA06] font-semibold text-gray-900 shadow-sm" : "hover:bg-[#FFCA06] text-gray-700 dark:text-white"}`}
        >
          <img src={usericon} alt="usericon" className="w-4 h-4 dark:invert" />
          <h1 className="text-[12px] font-medium">All Contacts</h1>
        </div>

        <div className="border-t border-gray-200 dark:border-slate-800 mt-4"></div>

        <div className="flex flex-col flex-1 overflow-hidden pt-2 gap-4">
          
          {/* CALLING LISTS Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-2 px-2 text-gray-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider shrink-0">
              <span>Calling Lists</span>
              <button
                onClick={() => handleCreateList()}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
              >
                <FiPlus size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 px-1">
              {rootLists.map(list => renderCallingListItem(list, false))}

              {!isLoading && rootLists.length === 0 && (
                <div className="text-center py-4 opacity-40 text-[10px] font-bold uppercase tracking-widest italic">
                  Empty
                </div>
              )}
            </div>
          </div>

          <div className="border-t border-gray-100 dark:border-slate-800 shrink-0"></div>

          {/* FOLDERS Section */}
          <div className="flex-1 flex flex-col min-h-0">
            <div className="flex justify-between items-center mb-2 px-2 text-gray-500 dark:text-slate-400 uppercase font-bold text-[10px] tracking-wider shrink-0">
              <span>Folders</span>
              <button
                onClick={() => handleCreateFolder()}
                className="p-1 hover:bg-gray-100 dark:hover:bg-slate-800 rounded transition-colors"
              >
                <FiPlus size={14} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-1 px-1">
              {renderTree(null, 0, true)}
              
              {!isLoading && folders.length === 0 && (
                <div className="text-center py-4 opacity-40 text-[10px] font-bold uppercase tracking-widest italic">
                   Empty
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 mt-auto border-t border-gray-200 dark:border-slate-800">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="w-full text-[12px] flex items-center justify-center gap-2 py-2.5 bg-[#F0F2F4] dark:bg-slate-800 hover:bg-[#E2E8F0] dark:hover:bg-slate-700 transition-all text-[#2B3034] dark:text-white font-bold rounded-md shadow-sm"
          >
            <LuArrowUpToLine className="text-lg" />
            <span>IMPORT FILE</span>
          </button>
        </div>

        <ImportContactModal
          isOpen={isImportModalOpen}
          onClose={() => setIsImportModalOpen(false)}
          onSuccess={handleImportSuccess}
        />

      <StructureModal
        isOpen={modalConfig.isOpen}
        onClose={() => setModalConfig({ ...modalConfig, isOpen: false })}
        onSave={handleModalSave}
        title={modalConfig.title}
        placeholder={modalConfig.placeholder}
        defaultValue={modalConfig.defaultValue || ''}
        saveLabel={modalConfig.type === 'rename-list' ? 'Rename' : 'Save'}
      />
    </aside>
  );
};

export default AdminAllContactSidebar;
