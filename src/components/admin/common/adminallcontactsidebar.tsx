import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { VscFolderOpened } from "react-icons/vsc";
import { LuArrowUpToLine } from "react-icons/lu";
import usericon from "../../../assets/admin/usericons.png";
import { useContact, type ContactList, type ContactFolder, type ContactGroup } from "@/hooks/useContact";

interface AllContactSidebarProps {
  onSelectItem: (item: string) => void;
}

interface FolderWithLists extends ContactFolder {
  nestedLists: ContactList[];
}

const AdminAllContactSidebar: React.FC<AllContactSidebarProps> = ({ onSelectItem }) => {
  const [activeItem, setActiveItem] = useState("allContacts");
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const { getContactLists, getContactFolders, getContactGroups, loading } = useContact();

  const [folders, setFolders] = useState<FolderWithLists[]>([]);
  const [standaloneLists, setStandaloneLists] = useState<ContactList[]>([]);
  const [groups, setGroups] = useState<ContactGroup[]>([]);

  // ✅ Back button logic
  let backTo = "/";
  if (location.pathname === "/admin/data-dialer") {
    backTo = "/admin";
  } else if (location.pathname === "/data-dialer") {
    backTo = "/";
  }

  useEffect(() => {
    onSelectItem("allContacts");

    const fetchData = async () => {
      const [allLists, allFolders, allGroups] = await Promise.all([
        getContactLists(),
        getContactFolders(),
        getContactGroups()
      ]);

      const folderMap = new Map<string, FolderWithLists>();
      const usedListIds = new Set<string>();

      allFolders.forEach(folder => {
        const nestedLists = allLists.filter(list => folder.listIds.includes(list.id));
        nestedLists.forEach(l => usedListIds.add(l.id));
        folderMap.set(folder.id, { ...folder, nestedLists });
      });

      setFolders(Array.from(folderMap.values()));
      setStandaloneLists(allLists.filter(list => !usedListIds.has(list.id)));
      setGroups(allGroups);
    };

    fetchData();
  }, []);

  const handleClick = (item: string) => {
    setActiveItem(item);
    onSelectItem(item);
  };

  // ✅ Handle File Select
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log("Selected File:", file);
    }
  };

  return (
    <aside className="bg-white flex flex-col px-5 py-4 w-64 h-screen shadow-sm">
      {/* Back Button */}
      <Link
        to={backTo}
        className="flex gap-2 items-center cursor-pointer hover:text-[#FFCA06] transition"
      >
        <IoIosArrowBack className="text-2xl" />
        <span className="text-[16px] text-[#495057] font-medium">Back To Home</span>
      </Link>

      <div className="border-b border-gray-100 h-1 my-3"></div>

      {/* All Contacts */}
      <div
        onClick={() => handleClick("allContacts")}
        className={`flex gap-2 items-center px-2 py-2 rounded-md cursor-pointer transition 
          ${activeItem === "allContacts" ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
      >
        <img src={usericon} alt="usericon" className="w-6 h-6" />
        <h1 className="text-[#495057] font-medium text-[14px]">All Contacts</h1>
      </div>

      <div className="border-b border-gray-100 h-1 my-3"></div>

      {/* Calling Lists */}
      <div className="flex flex-col gap-2 overflow-hidden">
        <h1 className="text-[#495057] font-medium uppercase text-[14px]">Calling Lists</h1>
        <div className="flex gap-2 h-[45vh] px-1.5 overflow-auto custom-scrollbar flex-col">
          {folders.map((folder) => (
            <div key={folder.id} className="flex flex-col gap-1.5">
              <div
                onClick={() => handleClick(folder.name)}
                className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
                  ${activeItem === folder.name ? "bg-[#FFCA06]" : "bg-gray-50 hover:bg-[#FFCA06]"}`}
              >
                <VscFolderOpened className="text-lg" />
                <h1 className="text-[#495057] font-medium text-[14px] truncate">{folder.name}</h1>
              </div>

              <div className="flex gap-2 flex-col pl-4">
                {folder.nestedLists.map((list) => (
                  <div
                    key={list.id}
                    onClick={() => handleClick(list.name)}
                    className={`text-[#495057] flex justify-between items-center px-2 py-1 rounded-md cursor-pointer transition
                    ${activeItem === list.name ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
                  >
                    <h1 className="text-[#495057] font-medium text-[14px] truncate">{list.name}</h1>
                    <h1 className="border border-gray-200 rounded-full text-[10px] px-1.5 py-1 uppercase">{list.name.slice(0, 2)}</h1>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {standaloneLists.map((list) => (
            <div
              key={list.id}
              onClick={() => handleClick(list.name)}
              className={`text-[#495057] flex justify-between items-center px-2 py-2 rounded-xl cursor-pointer transition
                ${activeItem === list.name ? "bg-[#FFCA06]" : "bg-gray-50 hover:bg-[#FFCA06]"}`}
            >
              <h1 className="text-[#495057] font-medium text-[14px] truncate">{list.name}</h1>
              <h1 className="border border-gray-200 rounded-full text-[10px] px-1.5 py-1 uppercase">{list.name.slice(0, 2)}</h1>
            </div>
          ))}

          {!loading && folders.length === 0 && standaloneLists.length === 0 && (
            <span className="text-xs text-gray-400 text-center py-4">No lists found</span>
          )}
        </div>
      </div>

      <div className="border-b border-gray-100 h-1 my-3"></div>

      {/* Groups */}
      <div className="flex flex-col gap-2 overflow-hidden">
        <h1 className="text-[#495057] uppercase font-medium text-[14px]">Groups</h1>
        <div className="flex gap-2 h-[25vh] px-1.5 overflow-auto custom-scrollbar flex-col">
          {groups.map((gro) => (
            <div
              key={gro.id}
              onClick={() => handleClick(gro.name)}
              className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
                ${activeItem === gro.name ? "bg-[#FFCA06]" : "bg-gray-50 hover:bg-[#FFCA06]"}`}
            >
              <h1 className="text-[#495057] font-medium text-[14px] truncate">{gro.name}</h1>
            </div>
          ))}
          {!loading && groups.length === 0 && (
            <span className="text-xs text-gray-400 text-center py-4">No groups found</span>
          )}
        </div>
      </div>

      {/* ✅ Fixed Bottom Import Button */}
      <div className="mt-auto pt-2">
        <button
          onClick={openFileDialog}
          className="w-full text-sm flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 text-[#495057] font-medium rounded-md transition"
        >
          <LuArrowUpToLine className="text-base" />
          Import File
        </button>

        <input
          type="file"
          ref={fileInputRef}
          className="hidden"
          onChange={handleFileChange}
        />
      </div>
    </aside>
  );
};

export default AdminAllContactSidebar;
