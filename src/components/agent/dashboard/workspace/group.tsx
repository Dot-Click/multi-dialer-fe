const Group = () => {

    const groups = [
        { id: 1, name: "Group Name", contact: "115" },
        { id: 2, name: "Group Name", contact: "115" },
        { id: 3, name: "Group Name", contact: "115" },
        { id: 4, name: "Group Name", contact: "115" },
        { id: 5, name: "Group Name", contact: "115" },
        { id: 6, name: "Group Name", contact: "115" },
        { id: 7, name: "Group Name", contact: "115" },
    ]

    return (
        <section className='bg-white dark:bg-slate-800  flex flex-col h-[35vh] md:h-[28vh] lg:h-[38vh] gap-5  rounded-[32px] px-[24px] pt-[24px] pb-[32px]  w-full '>
            <div className="flex justify-between items-center">
                <h1 className="text-[20px] dark:text-white text-[#000000] font-[500]">Groups</h1>
            </div>


            <div className='flex flex-col gap-3  overflow-auto custom-scrollbar'>
                {groups.map((gr) => (
                    <div key={gr.id} className='flex mx-2 rounded-md border-b gap-2 items-center dark:border-slate-700 border-gray-200'>
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

export default Group