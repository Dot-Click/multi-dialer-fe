// import { useState, useEffect } from "react";
// import { Link } from "react-router-dom"
// import { IoIosArrowBack } from "react-icons/io";
// import { BiSolidContact } from "react-icons/bi";
// import { VscFolderOpened } from "react-icons/vsc";


// interface AllContactSidebarProps {
//   onSelectItem: (item: string) => void;
// }


// const AllContactSidebar: React.FC<AllContactSidebarProps> = ({ onSelectItem }) => {
//   const [activeItem, setActiveItem] = useState("allContacts");

//   useEffect(() => {
//     // send default selection
//     onSelectItem("allContacts");
//   }, []);

//   const callingLists = [
//     {
//       id: 1,
//       folder: "Folder 1",
//       lists: ["List 01", "List 02"],
//     },
//     {
//       id: 2,
//       folder: "Folder 2",
//       lists: ["List 03", "List 04", "List 05", "List 06", "List 07", "List 08"],
//     },
//   ];

//   const group = [
//     { id: 1, name: "group" },
//     { id: 2, name: "group" },
//     { id: 3, name: "group" },
//     { id: 4, name: "group" },
//     { id: 5, name: "group" },
//   ];

//   const handleClick = (item: string) => {
//     setActiveItem(item);
//     onSelectItem(item);
//   };

//   return (
//     <aside className="bg-white flex gap-4 flex-col px-5 py-4 w-64 h-screen  ">
//       <Link
//         to={'/'}
//         className="flex gap-2 items-center cursor-pointer hover:text-[#FFCA06] transition"
//       >
//         <IoIosArrowBack className="text-2xl" />
//         <span className="text-[16px] text-[#495057] font-[500]">Back to Home</span>
//       </Link>

//       <div className="border-b border-gray-100 h-1"></div>

//       {/* All Contacts */}
//       <div
//         onClick={() => handleClick("allContacts")}
//         className={`flex gap-2 items-center px-2 py-2 rounded-md cursor-pointer transition 
//           ${activeItem === "allContacts" ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
//       >
//         <BiSolidContact className="text-lg" />
//         <h1 className="text-[#495057] font-[500] text-[14px]">All Contacts</h1>
//       </div>

//       <div className="border-b border-gray-100 h-1"></div>

//       {/* Calling Lists */}
//       <div className="flex flex-col gap-2">
//         <h1 className="text-[#495057] font-[500] text-[14px]">Calling Lists</h1>
//         <div className="flex gap-2 h-[45vh] px-1.5 overflow-auto custom-scrollbar flex-col">
//           {callingLists.map((list) => (
//             <div key={list.id} className="flex flex-col gap-1.5">
//               <div
//                 onClick={() => handleClick(list.folder)}
//                 className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
//                   ${activeItem === list.folder
//                     ? "bg-[#FFCA06]"
//                     : "bg-gray-50 hover:bg-[#FFCA06]"
//                   }`}
//               >
//                 <VscFolderOpened className="text-lg" />
//                 <h1 className="text-[#495057] font-[500] text-[14px]">
//                   {list.folder}
//                 </h1>
//               </div>

//               <div className="flex gap-2 flex-col">
//                 {list.lists.map((li, index) => (
//                   <div
//                     key={index}
//                     onClick={() => handleClick(li)}
//                     className={`text-[#495057] flex justify-between items-center px-2 py-1 rounded-md cursor-pointer transition
//                       ${activeItem === li ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
//                   >
//                     <h1 className="text-[#495057] font-[500] text-[14px]">{li}</h1>
//                     <h1 className="border border-gray-200 rounded-full text-[12px] px-2 py-1.5">
//                       JL
//                     </h1>
//                   </div>
//                 ))}
//               </div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Groups */}
//       <div className="flex flex-col gap-2">
//         <h1 className="text-[#495057] font-[500] text-[14px]">Groups</h1>
//         <div className="flex gap-2 h-[25vh] px-1.5 overflow-auto custom-scrollbar flex-col">
//           {group.map((gro) => (
//             <div
//               key={gro.id}
//               onClick={() => handleClick(gro.name + gro.id)}
//               className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
//                 ${activeItem === gro.name + gro.id
//                   ? "bg-[#FFCA06]"
//                   : "bg-gray-50 hover:bg-[#FFCA06]"
//                 }`}
//             >
//               <h1 className="text-[#495057] font-[500] text-[14px]">
//                 {gro.name}
//               </h1>
//             </div>
//           ))}
//         </div>
//       </div>
//     </aside>
//   );
// };

// export default AllContactSidebar;









import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
// import { BiSolidContact } from "react-icons/bi";
import usericon from "../../../assets/admin/usericons.png";
import { VscFolderOpened } from "react-icons/vsc";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchFolders, fetchLists, fetchGroups, type ContactFolder, type ContactList, type ContactGroup } from "@/store/slices/contactStructureSlice";

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
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const location = useLocation();
  const dispatch = useAppDispatch();
  const { folders, lists, groups } = useAppSelector((state) => state.contactStructure);

  // ✅ Back button logic
  let backTo = "/";
  if (location.pathname === "/admin/data-dialer") {
    backTo = "/admin";
  } else if (location.pathname === "/data-dialer") {
    backTo = "/";
  }

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

  const toggleFolder = (id: string) => {
    setExpandedFolders(prev => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  // Find lists that don't belong to any folder
  const folderListIds = new Set(folders.flatMap(f => f.listIds || []));
  const standaloneLists = lists.filter(list => !folderListIds.has(list.id));

  return (
    <aside className="bg-white flex gap-4 flex-col px-5 py-4 w-64 h-screen  ">

      {/* ✅ Updated Back Button */}
      <Link
        to={backTo}
        className="flex gap-2 items-center cursor-pointer hover:text-[#FFCA06] transition"
      >
        <IoIosArrowBack className="text-2xl" />
        <span className="text-[16px] text-[#495057] font-[500]">Back To Home</span>
      </Link>

      <div className="border-b border-gray-100 h-1"></div>

      {/* All Contacts */}
      <div
        onClick={() => handleClick("allContacts", "All Contacts")}
        className={`flex gap-2 items-center px-2 py-2 rounded-md cursor-pointer transition 
          ${activeItem === "allContacts" ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
      >
        <img src={usericon} alt="usericon" className="w-6 h-6" />
        <h1 className="text-[#495057] font-[500] text-[14px]">All Contacts</h1>
      </div>

      <div className="border-b border-gray-100 h-1"></div>

      {/* Calling Lists */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[#495057] font-[500] uppercase text-[14px]">Calling Lists</h1>
        <div className="flex gap-2 h-[45vh] px-1.5 overflow-auto custom-scrollbar flex-col">
          {folders.map((folder: ContactFolder) => (
            <div key={folder.id} className="flex flex-col gap-1.5">
              <div
                onClick={() => toggleFolder(folder.id)}
                className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
                   bg-gray-50 hover:bg-[#FFCA06]`}
              >
                <VscFolderOpened className="text-lg" />
                <h1 className="text-[#495057] font-[500] text-[14px] truncate">
                  {folder.name}
                </h1>
              </div>

              {expandedFolders.has(folder.id) && (
                <div className="flex gap-2 flex-col">
                  {lists
                    .filter((list: ContactList) => folder.listIds?.includes(list.id))
                    .map((list: ContactList) => (
                      <div
                        key={list.id}
                        onClick={() => handleClick("list", list.name, list.id)}
                        className={`text-[#495057] flex justify-between items-center px-2 py-1 rounded-md cursor-pointer transition
                          ${activeItem === `list-${list.id}` ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
                      >
                        <h1 className="text-[#495057] font-[500] text-[14px] truncate">{list.name}</h1>
                        <h1 className="border border-gray-200 rounded-full text-[12px] px-2 py-1.5">
                          {getInitials(list.name)}
                        </h1>
                      </div>
                    ))}
                </div>
              )}
            </div>
          ))}

          {/* Standalone Lists */}
          {standaloneLists.map((list: ContactList) => (
            <div
              key={list.id}
              onClick={() => handleClick("list", list.name, list.id)}
              className={`text-[#495057] flex justify-between items-center px-2 py-1 rounded-md cursor-pointer transition
                ${activeItem === `list-${list.id}` ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
            >
              <h1 className="text-[#495057] font-[500] text-[14px] truncate">{list.name}</h1>
              <h1 className="border border-gray-200 rounded-full text-[12px] px-2 py-1.5">
                {getInitials(list.name)}
              </h1>
            </div>
          ))}
        </div>
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[#495057] uppercase font-[500] text-[14px]">Groups</h1>
        <div className="flex gap-2 h-[25vh] px-1.5 overflow-auto custom-scrollbar flex-col">
          {groups.map((gro: ContactGroup) => (
            <div
              key={gro.id}
              onClick={() => handleClick("group", gro.name, gro.id)}
              className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
                ${activeItem === `group-${gro.id}`
                  ? "bg-[#FFCA06]"
                  : "bg-gray-50 hover:bg-[#FFCA06]"
                }`}
            >
              <h1 className="text-[#495057] font-[500] text-[14px] truncate">
                {gro.name}
              </h1>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
};

export default AllContactSidebar;
