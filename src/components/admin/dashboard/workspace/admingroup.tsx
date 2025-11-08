


const AdminGroup = () => {

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
        <section className='bg-white flex flex-col h-[35vh] md:h-[28vh] lg:h-[35vh] gap-5 rounded-4xl px-6 py-5  w-full '>
            <div className="flex justify-between items-center">
                <h1 className="text-[20px] font-[500]">Groups</h1>
            </div>


            <div className='flex flex-col gap-5  overflow-auto custom-scrollbar'>
                {groups.map((gr) => (
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

export default AdminGroup