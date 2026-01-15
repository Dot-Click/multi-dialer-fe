

const SuperAdminReportsData = () => {


    const data = [
        { id: 1, name: "Total Revenue", number: "$75,000", data: "+12.5% from last month" },
        { id: 2, name: "Active Subscriptions", number: "287", data: "+8.3% from last month" },
        { id: 3, name: "New Signups", number: "75", data: "+15.4% from last month" },
        { id: 4, name: "Total Calls Processed", number: "125,430", data: "+22.1% from last month" },
    ]


    return (
        <section className="bg-white  outfit rounded-[13.48px]  shadow-sm px-[12px] py-[14px] lg:px-[28px] w-full lg:py-[24px]">
            <div className="flex flex-col gap-5">

                <div className="flex items-center justify-around gap-20">
                    {data.map((dt) => (
                        <div key={dt.id} className="flex flex-col gap-1">
                            <span className="text-[8px] md:text-[10px] lg:text-[15.41px] text-[#898989] font-[400]">{dt.name}</span>
                            <span className="text-[13px] md:text-[24px] text-[#2C2C2C] lg:text-[26.96px] font-[600]">{dt.number}</span>
                            <span className="text-[8px] md:text-[10px] lg:text-[15.41px] text-[#030213] font-[400]">{dt.data}</span>
                        </div>
                    ))}
                </div>
            </div>

        </section>
    )
}

export default SuperAdminReportsData