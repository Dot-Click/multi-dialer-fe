import vector from "@/assets/Vector.png"

const BussinessOverviews = () => {

    const data = [
        { id: 1, name: "Total Revenue (MRR)", number: "$284,590" },
        { id: 2, name: "Active Subscriptions", number: "1,247" },
        { id: 3, name: "Active Users", number: "342" },
        { id: 4, name: "Total Agents Across Platform", number: "8,456" },
        { id: 5, name: "Failed Payments", number: "23" },
        { id: 6, name: "Renewals Due (30 days)", number: "156" },
    ]

    return (
        <section className="bg-white outfit rounded-[13.48px] shadow-sm px-[12px] py-[14px] lg:px-[28px] w-full lg:py-[24px]">
            <div className="flex flex-col gap-5">
                
                <div className="flex items-center gap-1 lg:gap-3">
                    <img
                        src={vector}
                        alt="vector icon"
                        className="h-[13px] md:h-[16px] lg:h-[20px] w-[12px] md:w-[16px] lg:w-[16px]"
                    />
                    <span className="text-[12px] work-sans md:text-[17px] text-[#000000] lg:text-[20px] font-[500]">
                        Business Overview
                    </span>
                </div>

                <div className="flex items-center  justify-around gap-3 md:gap-5 lg:gap-7">
                     {data.map((dt, index) => (
                        <div
                            key={dt.id}
                            className={`flex pl-4 flex-col gap-1
                                ${index !== 0 ? "border-l border-[#E5E7EB]" : ""}
                            `}
                        >
                            <span className="text-[13px] md:text-[18px] text-[#2C2C2C] lg:text-[25px] font-[600]">
                                {dt.number}
                            </span>
                            <span className="text-[8px] md:text-[9px] lg:text-[13px] text-[#030213] font-[400]">
                                {dt.name}
                            </span>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    )
}

export default BussinessOverviews
