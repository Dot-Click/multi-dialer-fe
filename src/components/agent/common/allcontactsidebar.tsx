import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import usericon from "../../../assets/admin/usericons.png";
import { VscFolderOpened } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFolders, fetchLists, fetchGroups, type ContactFolder, type ContactList } from "@/store/slices/contactStructureSlice";

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
  // const location = useLocation();
  const dispatch = useAppDispatch();
  const { folders, lists } = useAppSelector((state) => state.contactStructure);

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

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Find lists that don't belong to any folder
  // const folderListIds = new Set(folders.flatMap(f => f.listIds || []));
  // const standaloneLists = lists.filter(list => !folderListIds.has(list.id));

  return (
    <aside className="bg-white dark:bg-slate-800 flex gap-4 flex-col px-5 py-4 w-64 h-screen  ">

      {/* ✅ Updated Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="flex gap-2 items-center cursor-pointer hover:text-[#FFCA06] dark:text-white transition"
      >
        <IoIosArrowBack className="text-2xl" />
        <span className="text-[16px] text-[#495057] dark:text-white font-medium">
          Back
        </span>
      </button>

      <div className="border-b border-gray-100 h-1"></div>

      {/* All Contacts */}
      <div
        onClick={() => handleClick("allContacts", "All Contacts")}
        className={`flex gap-2 items-center px-2 py-2 rounded-md cursor-pointer transition 
          ${activeItem === "allContacts" ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
      >
        <img src={usericon} alt="usericon" className="w-6 h-6" />
        <h1 className="text-[#495057] dark:text-white font-medium text-[14px]">All Contacts</h1>
      </div>

      <div className="border-b border-gray-100 h-1"></div>

      {/* Calling Lists */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[#495057] dark:text-white font-medium uppercase text-[14px]">Calling Lists</h1>
        <div className="flex gap-2 h-[40vh] px-1.5 overflow-auto custom-scrollbar flex-col">
          {lists.map((list: ContactList) => (
            <div
              key={list.id}
              onClick={() => handleClick("list", list.name, list.id)}
              className={`text-[#495057] dark:text-white flex justify-between items-center px-2 py-1 rounded-md cursor-pointer transition
                ${activeItem === `list-${list.id}` ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
            >
              <h1 className="text-[#495057] dark:text-white font-medium text-[14px] truncate">{list.name}</h1>
              <h1 className="border border-gray-200 dark:border-slate-600 rounded-full text-[12px] px-2 py-1.5 whitespace-nowrap">
                {getInitials(list.name)}
              </h1>
            </div>
          ))}
        </div>
      </div>

      {/* Folders */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[#495057] dark:text-white uppercase font-medium text-[14px]">Folders</h1>
        <div className="flex gap-2 h-[30vh] px-1.5 overflow-auto custom-scrollbar flex-col">
          {folders.map((folder: ContactFolder) => (
            <div
              key={folder.id}
              onClick={() => handleClick("folder", folder.name, folder.id)}
              className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
                ${activeItem === `folder-${folder.id}`
                  ? "bg-[#FFCA06]"
                  : "bg-gray-50 dark:bg-slate-700/50 hover:bg-[#FFCA06]"
                }`}
            >
              <VscFolderOpened className="text-lg" />
              <h1 className="text-[#495057] dark:text-white font-medium text-[14px] truncate">
                {folder.name}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AllContactSidebar;
