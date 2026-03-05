import vector from "@/assets/Vector.png"


const AiInsightToday = () => {

    const data = [
        { id: 1, name: "Calls analyzed", number: "123" },
        { id: 2, name: "Success prediction", number: "65%" },
        { id: 3, name: "Urgent follow-ups detected", number: "10" },
    ]

    return (
        <section className="bg-white dark:bg-slate-800 rounded-[32px] flex flex-col gap-3 shadow-md px-[12px] py-[14px] lg:px-[24px] w-full lg:pt-[24px] lg:pb-[32px]">
            <div className="flex items-center gap-1 lg:gap-2">
                <img src={vector} alt="vector icon" className="h-[13px] md:h-[16px] lg:h-[20px] w-[12px] md:w-[16px] lg:w-[16px]" />
                <span className="text-[12px] md:text-[17px] lg:text-[20px] dark:text-white text-[#000000] font-[500]">AI Insights Today</span>
            </div>

            <div className="flex items-center w-full lg:w-[85%] justify-between ">
                {data.map((dt)=>(
                    <div key={dt.id} className="flex text-[#000000] dark:text-white flex-col">
                        <span className="text-[13px] md:text-[24px] lg:text-[40px] font-[600]">{dt.number}</span>
                        <span className="text-[8px] dark:text-gray-400 text-[#495057] md:text-[10px] lg:text-[14px] font-500">{dt.name}</span>

                    </div>
                ))}
            </div>

        </section>
    )
}

export default AiInsightToday