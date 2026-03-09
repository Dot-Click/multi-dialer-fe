import { useState } from 'react';

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

    const [active, setActive] = useState(1);

    return (
        <section className='bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-5 rounded-[32px] px-[24px] pt-[24px] pb-[32px] md:w-[50%]  w-full '>
            <div className="flex flex-col justify-between gap-1.5">
                <h1 className="text-[20px] dark:text-white text-[#000000] font-[500]">Folders & Lists</h1>
                <div className='flex gap-3'>
                    {folderLists.map((dt) => (
                        <button
                            key={dt.id}
                            onClick={() => setActive(dt.id)}
                            className={
                                active === dt.id
                                    ? "border px-2 rounded-md font-[500] cursor-pointer py-1 text-[9px] md:text-[12px] dark:bg-slate-700 bg-[#0E1011] text-white"
                                    : "border px-2 rounded-md text-gray-950 dark:text-gray-400 font-[500] cursor-pointer hover:bg-gray-200 py-1 text-[9px] md:text-[12px]"
                            }
                        >
                            {dt.name}
                        </button>
                    ))}
                </div>
            </div>

            <div className='flex flex-col gap-5  overflow-auto custom-scrollbar'>
                {listName.map((gr) => (
                    <div key={gr.id} className='flex mx-2  border-b gap-2 items-center border-gray-200'>
                        <div className="flex flex-col justify-between w-full">
                            <h1 className="text-[14px] dark:text-white font-[500] text-[#000000]">{gr.name}</h1>
                            <h1 className="text-[14px] dark:text-gray-400 font-[400] text-[#495057]">Contacts: {gr.contact}</h1>
                        </div>
                    </div>
                ))}
            </div>

        </section>
    )
}

export default FoldersList;
