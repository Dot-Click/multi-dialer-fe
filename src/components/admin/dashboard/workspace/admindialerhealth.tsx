
const AdminDialerHealth = () => {

    const dialers = [
        { id: 1, name: "Person Name", contact: "(832) 704-2910", health: "healthy" },
        { id: 2, name: "Person Name", contact: "(832) 704-2910", health: "spam" },
        { id: 3, name: "Person Name", contact: "(832) 704-2910", health: "healthy" },
        { id: 4, name: "Person Name", contact: "(832) 704-2910", health: "spam" },
        { id: 5, name: "Person Name", contact: "(832) 704-2910", health: "healthy" },
        { id: 6, name: "Person Name", contact: "(832) 704-2910", health: "spam" },
        { id: 7, name: "Person Name", contact: "(832) 704-2910", health: "healthy" },
    ];

    return (
        <section className='bg-white flex flex-col h-[35vh] md:h-[28vh] lg:h-[35vh] gap-5 rounded-4xl px-6 py-5  w-full '>
            <div className="flex justify-between items-center">
                <h1 className="text-[20px] font-[500]">Dialer Health</h1>
            </div>

            <div className='flex flex-col gap-5  overflow-auto custom-scrollbar'>
                {dialers.map((dial) => {
                    let bgColor = "";
                    let textColor ="";

                    switch (dial.health) {
                        case "healthy":
                            bgColor = "bg-green-100";
                            textColor= "text-green-700"
                            break;
                        case "spam":
                            bgColor = "bg-red-100";
                            textColor= "text-red-700"

                            break;
                        default:
                            bgColor = "bg-gray-400";
                            textColor = "text-black";
                    }

                    return (
                        <div key={dial.id} className='flex mx-2 rounded-md border-b gap-2 items-center border-gray-100'>
                            <div className="flex justify-between w-full pr-3 items-center">
                                <div>
                                    <h1 className="text-[14px] font-[500] text-gray-950">{dial.name}</h1>
                                    <h1 className="text-[12px] font-[400] text-[#495057]">{dial.contact}</h1>
                                </div>
                                <div className={`rounded-lg px-2 py-0.5 ${bgColor}`}>
                                    <span className={`text-xs font-[500] capitalize ${textColor}`}>{dial.health}</span>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default AdminDialerHealth;
