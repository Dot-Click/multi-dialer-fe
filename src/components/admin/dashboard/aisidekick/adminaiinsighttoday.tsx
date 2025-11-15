import vector from "@/assets/Vector.png"


const AdminAiInsightToday = () => {

    const data = [
        { id: 1, name: "Calls analyzed", number: "565" },
        { id: 2, name: "Success prediction", number: "56%" },
        { id: 3, name: "Urgent follow-ups detected", number: "15" },
        { id: 4, name: "New Leads identified", number: "25" },
    ]

    return (
        <section className="bg-white rounded-xl flex flex-col gap-3 shadow-2xl px-[12px] py-[14px] lg:px-[20px] w-full lg:py-[15px]">
            <div className="flex items-center gap-1 lg:gap-2">
                <img src={vector} alt="vector icon" className="h-[13px] md:h-[16px] lg:h-[20px] w-[12px] md:w-[16px] lg:w-[16px]" />
                <span className="text-[12px] md:text-[17px] lg:text-[20px] font-[500]">AI Insights on Teams Today</span>
            </div>

            <div className="flex items-center justify-between">
                {data.map((dt)=>(
                    <div key={dt.id} className="flex flex-col">
                        <span className="text-[13px] md:text-[24px] lg:text-[40px] font-[600]">{dt.number}</span>
                        <span className="text-[8px] md:text-[10px] lg:text-[14px] text-[#495057] font-500">{dt.name}</span>

                    </div>
                ))}
            </div>

        </section>
    )
}

export default AdminAiInsightToday