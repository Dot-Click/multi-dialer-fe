
import React from "react";
import { IoIosArrowBack } from "react-icons/io";
import { BiSolidContact } from "react-icons/bi";
import { VscFolderOpened } from "react-icons/vsc";




const AllContactSidebar = () => {

    const callingLists = [
        {
            id: 1,
            folder: "Folder 1",
            lists: ["List 01", "List 02"],
        },
        {
            id: 2,
            folder: "Folder 2",
            lists: ["List", "List", "List", "List", "List", "List"],
        },
    ];


    const group = [
        {id:1,name:"group"},
        {id:2,name:"group"},
        {id:3,name:"group"},
        {id:4,name:"group"},
        {id:5,name:"group"},
    ]


    return (
        <aside className="bg-white flex gap-4 flex-col px-5 py-4 w-64 h-screen shadow-2xl ">
            <div className="flex gap-2 items-center">
                <span><IoIosArrowBack className="text-2xl " /></span>
                <span className="text-[16px] text-[#495057] font-[500]">Back to Home</span>
            </div>
            <div className=" border-b border-gray-100 h-1"></div>

            <div className="flex gap-2 items-center">
                <span><BiSolidContact className="text-lg " /></span>
                <h1 className="text-[#495057] font-[500] text-[14px]">All Contacts</h1>
            </div>

            <div className=" border-b border-gray-100 h-1"></div>

            <div className="flex flex-col   gap-2">
                <h1 className="text-[#495057] font-[500] text-[14px]">Colling Lists</h1>
                <div className="flex gap-2 h-[45vh] px-1.5 overflow-auto custom-scrollbar flex-col">
                    {callingLists.map((list) => (
                        <div key={list.id} className=" flex flex-col gap-1.5">
                            <div className="flex gap-2  bg-gray-50 rounded-xl px-2 py-2 items-center">
                                <span><VscFolderOpened className="text-lg " /></span>
                                <h1 className="text-[#495057] font-[500] text-[14px]">{list.folder}</h1>
                            </div>
                            <div className="flex gap-2 flex-col">
                                {list.lists.map((li)=>(
                                   <div className="text-[#495057] flex justify-between items-center">
                                    <h1 className="text-[#495057] font-[500] text-[14px]">{li}</h1>
                                    <h1 className="border border-gray-200 rounded-full text-[12px] px-2 py-1.5">JL</h1>
                                   </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <div className="flex flex-col   gap-2">
                <h1 className="text-[#495057] font-[500] text-[14px]">Groups</h1>
                <div className="flex gap-2 h-[25vh] px-1.5 overflow-auto custom-scrollbar flex-col">
                    {group.map((gro) => (
                        
                            <div className="flex gap-2  bg-gray-50 rounded-xl px-2 py-2 items-center">
                                <h1 className="text-[#495057] font-[500] text-[14px]">{gro.name}</h1>
                           
                        </div>
                    ))}
                </div>
            </div>

        </aside>
    );
};

export default AllContactSidebar;
