import React from 'react'
import { IoIosArrowForward } from 'react-icons/io'
import { BsThreeDots } from "react-icons/bs";


const FoldersList = () => {

    const folderLists = [
        { id: 1, name: "All Lists", },
        { id: 2, name: "Folder 1", },
        { id: 3, name: "Folder 2", },
        { id: 4, name: "Folder 3", },
        { id: 5, name: "Folder 4", },
    ]

      const listName = [
        { id: 1, name: "List Name", contact: "115" },
        { id: 2, name: "List Name", contact: "115" },
        { id: 3, name: "List Name", contact: "115" },
        { id: 4, name: "List Name", contact: "115" },
        { id: 5, name: "List Name", contact: "115" },
        { id: 6, name: "List Name", contact: "115" },
        { id: 7, name: "List Name", contact: "115" },
    ]



    return (
        <section className='bg-white flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-5 rounded-4xl px-6 py-5 md:w-[50%]  w-full '>
            <div className="flex flex-col justify-between gap-1.5">
                <h1 className="text-[20px] font-[500]">Folders & Lists</h1>
                <div className='flex gap-3'>
                    {folderLists.map((dt) => (
                        <button key={dt.id} className='border px-2 rounded-md text-gray-950 font-[500] cursor-pointer hover:bg-gray-200 py-1 text-[9px] md:text-[12px]'>{dt.name}</button>
                    ))}
                </div>
            </div>


            <div className='flex flex-col gap-5  overflow-auto custom-scrollbar'>
                {listName.map((gr) => (
                    <div key={gr.id} className='flex mx-2 rounded-md border-b gap-2 items-center border-gray-200'>
                        <div className="flex flex-col justify-between w-full">
                            <h1 className="text-[14px] font-[500] text-gray-950">{gr.name}</h1>
                            <h1 className="text-[12px] font-[400] text-[#495057]">Contacts: {gr.contact}</h1>

                        </div>
                    </div>
                ))}
            </div>



        </section>
    )
}

export default FoldersList