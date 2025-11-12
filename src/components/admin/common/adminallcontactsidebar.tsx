// // import { useState, useEffect } from "react";
// // import { Link } from "react-router-dom"
// // import { IoIosArrowBack } from "react-icons/io";
// // import { BiSolidContact } from "react-icons/bi";
// // import { VscFolderOpened } from "react-icons/vsc";


// // interface AllContactSidebarProps {
// //   onSelectItem: (item: string) => void;
// // }


// // const AllContactSidebar: React.FC<AllContactSidebarProps> = ({ onSelectItem }) => {
// //   const [activeItem, setActiveItem] = useState("allContacts");

// //   useEffect(() => {
// //     // send default selection
// //     onSelectItem("allContacts");
// //   }, []);

// //   const callingLists = [
// //     {
// //       id: 1,
// //       folder: "Folder 1",
// //       lists: ["List 01", "List 02"],
// //     },
// //     {
// //       id: 2,
// //       folder: "Folder 2",
// //       lists: ["List 03", "List 04", "List 05", "List 06", "List 07", "List 08"],
// //     },
// //   ];

// //   const group = [
// //     { id: 1, name: "group" },
// //     { id: 2, name: "group" },
// //     { id: 3, name: "group" },
// //     { id: 4, name: "group" },
// //     { id: 5, name: "group" },
// //   ];

// //   const handleClick = (item: string) => {
// //     setActiveItem(item);
// //     onSelectItem(item);
// //   };

// //   return (
// //     <aside className="bg-white flex gap-4 flex-col px-5 py-4 w-64 h-screen shadow-2xl">
// //       <Link
// //         to={'/'}
// //         className="flex gap-2 items-center cursor-pointer hover:text-[#FFCA06] transition"
// //       >
// //         <IoIosArrowBack className="text-2xl" />
// //         <span className="text-[16px] text-[#495057] font-[500]">Back to Home</span>
// //       </Link>

// //       <div className="border-b border-gray-100 h-1"></div>

// //       {/* All Contacts */}
// //       <div
// //         onClick={() => handleClick("allContacts")}
// //         className={`flex gap-2 items-center px-2 py-2 rounded-md cursor-pointer transition 
// //           ${activeItem === "allContacts" ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
// //       >
// //         <BiSolidContact className="text-lg" />
// //         <h1 className="text-[#495057] font-[500] text-[14px]">All Contacts</h1>
// //       </div>

// //       <div className="border-b border-gray-100 h-1"></div>

// //       {/* Calling Lists */}
// //       <div className="flex flex-col gap-2">
// //         <h1 className="text-[#495057] font-[500] text-[14px]">Calling Lists</h1>
// //         <div className="flex gap-2 h-[45vh] px-1.5 overflow-auto custom-scrollbar flex-col">
// //           {callingLists.map((list) => (
// //             <div key={list.id} className="flex flex-col gap-1.5">
// //               <div
// //                 onClick={() => handleClick(list.folder)}
// //                 className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
// //                   ${activeItem === list.folder
// //                     ? "bg-[#FFCA06]"
// //                     : "bg-gray-50 hover:bg-[#FFCA06]"
// //                   }`}
// //               >
// //                 <VscFolderOpened className="text-lg" />
// //                 <h1 className="text-[#495057] font-[500] text-[14px]">
// //                   {list.folder}
// //                 </h1>
// //               </div>

// //               <div className="flex gap-2 flex-col">
// //                 {list.lists.map((li, index) => (
// //                   <div
// //                     key={index}
// //                     onClick={() => handleClick(li)}
// //                     className={`text-[#495057] flex justify-between items-center px-2 py-1 rounded-md cursor-pointer transition
// //                       ${activeItem === li ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
// //                   >
// //                     <h1 className="text-[#495057] font-[500] text-[14px]">{li}</h1>
// //                     <h1 className="border border-gray-200 rounded-full text-[12px] px-2 py-1.5">
// //                       JL
// //                     </h1>
// //                   </div>
// //                 ))}
// //               </div>
// //             </div>
// //           ))}
// //         </div>
// //       </div>

// //       {/* Groups */}
// //       <div className="flex flex-col gap-2">
// //         <h1 className="text-[#495057] font-[500] text-[14px]">Groups</h1>
// //         <div className="flex gap-2 h-[25vh] px-1.5 overflow-auto custom-scrollbar flex-col">
// //           {group.map((gro) => (
// //             <div
// //               key={gro.id}
// //               onClick={() => handleClick(gro.name + gro.id)}
// //               className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
// //                 ${activeItem === gro.name + gro.id
// //                   ? "bg-[#FFCA06]"
// //                   : "bg-gray-50 hover:bg-[#FFCA06]"
// //                 }`}
// //             >
// //               <h1 className="text-[#495057] font-[500] text-[14px]">
// //                 {gro.name}
// //               </h1>
// //             </div>
// //           ))}
// //         </div>
// //       </div>
// //     </aside>
// //   );
// // };

// // export default AllContactSidebar;









// import { useState, useEffect } from "react";
// import { Link, useLocation } from "react-router-dom";
// import { IoIosArrowBack } from "react-icons/io";
// import { BiSolidContact } from "react-icons/bi";
// import { VscFolderOpened } from "react-icons/vsc";
// import { LuArrowUpToLine } from "react-icons/lu";


// interface AllContactSidebarProps {
//   onSelectItem: (item: string) => void;
// }

// const AdminAllContactSidebar: React.FC<AllContactSidebarProps> = ({ onSelectItem }) => {
//   const [activeItem, setActiveItem] = useState("allContacts");
//   const location = useLocation();

//   // ✅ Back button logic
//   let backTo = "/";
//   if (location.pathname === "/admin/data-dialer") {
//     backTo = "/admin";
//   } else if (location.pathname === "/data-dialer") {
//     backTo = "/";
//   }

//   useEffect(() => {
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
//     <aside className="bg-white flex gap-4 flex-col px-5 py-4 w-64 h-screen shadow-2xl">

//       {/* ✅ Updated Back Button */}
//       <Link
//         to={backTo}
//         className="flex gap-2 items-center cursor-pointer hover:text-[#FFCA06] transition"
//       >
//         <IoIosArrowBack className="text-2xl" />
//         <span className="text-[16px] text-[#495057] font-[500]">Back</span>
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

// export default AdminAllContactSidebar;




import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { IoIosArrowBack } from "react-icons/io";
import { BiSolidContact } from "react-icons/bi";
import { VscFolderOpened } from "react-icons/vsc";
import { LuArrowUpToLine } from "react-icons/lu";

interface AllContactSidebarProps {
  onSelectItem: (item: string) => void;
}

const AdminAllContactSidebar: React.FC<AllContactSidebarProps> = ({ onSelectItem }) => {
  const [activeItem, setActiveItem] = useState("allContacts");
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // ✅ Back button logic
  let backTo = "/";
  if (location.pathname === "/admin/data-dialer") {
    backTo = "/admin";
  } else if (location.pathname === "/data-dialer") {
    backTo = "/";
  }

  useEffect(() => {
    onSelectItem("allContacts");
  }, []);

  const callingLists = [
    { id: 1, folder: "Folder 1", lists: ["List 01", "List 02"] },
    { id: 2, folder: "Folder 2", lists: ["List 03", "List 04", "List 05", "List 06", "List 07", "List 08"] },
  ];

  const group = [
    { id: 1, name: "group" },
    { id: 2, name: "group" },
    { id: 3, name: "group" },
    { id: 4, name: "group" },
    { id: 5, name: "group" },
  ];

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
      // ✅ Yahan se aap file upload logic laga sakte ho
    }
  };

  return (
    <aside className="bg-white flex flex-col px-5 py-4  w-64 h-screen shadow-2xl">

      {/* Back Button */}
      <Link
        to={backTo}
        className="flex gap-2 items-center cursor-pointer hover:text-[#FFCA06] transition"
      >
        <IoIosArrowBack className="text-2xl" />
        <span className="text-[16px] text-[#495057] font-[500]">Back To Home</span>
      </Link>

      <div className="border-b  border-gray-100 h-1"></div>

      {/* All Contacts */}
      <div
        onClick={() => handleClick("allContacts")}
        className={`flex gap-2 mt-4  items-center px-2 py-2 rounded-md cursor-pointer transition 
          ${activeItem === "allContacts" ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
      >
        <BiSolidContact className="text-lg" />
        <h1 className="text-[#495057] font-[500] text-[14px]">All Contacts</h1>
      </div>

      <div className="border-b border-gray-100 h-1"></div>

      {/* Calling Lists */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[#495057] font-[500] text-[14px]">Calling Lists</h1>
        <div className="flex gap-2 h-[45vh] px-1.5 overflow-auto custom-scrollbar flex-col">
          {callingLists.map((list) => (
            <div key={list.id} className="flex flex-col gap-1.5">
              <div
                onClick={() => handleClick(list.folder)}
                className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
                  ${activeItem === list.folder ? "bg-[#FFCA06]" : "bg-gray-50 hover:bg-[#FFCA06]"}`}
              >
                <VscFolderOpened className="text-lg" />
                <h1 className="text-[#495057] font-[500] text-[14px]">{list.folder}</h1>
              </div>

              <div className="flex gap-2 flex-col">
                {list.lists.map((li, index) => (
                  <div
                    key={index}
                    onClick={() => handleClick(li)}
                    className={`text-[#495057] flex justify-between items-center px-2 py-1 rounded-md cursor-pointer transition
                      ${activeItem === li ? "bg-[#FFCA06]" : "hover:bg-[#FFCA06]"}`}
                  >
                    <h1 className="text-[#495057] font-[500] text-[14px]">{li}</h1>
                    <h1 className="border border-gray-200 rounded-full text-[12px] px-2 py-1.5">JL</h1>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Groups */}
      <div className="flex flex-col gap-2">
        <h1 className="text-[#495057] font-[500] text-[14px]">Groups</h1>
        <div className="flex gap-2 h-[25vh] px-1.5 overflow-auto custom-scrollbar flex-col">
          {group.map((gro) => (
            <div
              key={gro.id}
              onClick={() => handleClick(gro.name + gro.id)}
              className={`flex gap-2 rounded-xl px-2 py-2 items-center cursor-pointer transition 
                ${activeItem === gro.name + gro.id ? "bg-[#FFCA06]" : "bg-gray-50 hover:bg-[#FFCA06]"}`}
            >
              <h1 className="text-[#495057] font-[500] text-[14px]">{gro.name}</h1>
            </div>
          ))}
        </div>
      </div>

      {/* ✅ Fixed Bottom Import Button */}
      <div className="mt-auto absolute bottom-0 left-0 shadow-2xl bg-white w-full px-4 py-2">
        <button
          onClick={openFileDialog}
          className="w-full text-sm flex items-center justify-center gap-2 py-2 bg-gray-100 hover:bg-gray-200 text-[#495057] font-medium rounded-md transition"
        >
          <LuArrowUpToLine className="text-base" />
          Import File
        </button>

        {/* ✅ Hidden File Input */}
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
