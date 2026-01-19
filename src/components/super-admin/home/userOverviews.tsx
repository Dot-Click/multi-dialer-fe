import vector from "@/assets/Vector.png"


const UserOverviews = () => {

    
    const data = [
        { id: 1, name: "New Users", number: "276" },
        { id: 2, name: "Active Subscriptions", number: "287" },
        { id: 3, name: "Total agents across platform", number: "3,245" },
        { id: 4, name: "Monthly Revenue (MRR)", number: "$122,847" },
    ]


  return (
     <section className="bg-white  outfit rounded-[13.48px]  shadow-sm px-[12px] py-[14px] lg:px-[28px] w-full lg:py-[24px]">
                    <div className="flex flex-col gap-5">
                        <div className="flex items-center gap-1 lg:gap-3">
                            <img src={vector} alt="vector icon" className="h-[13px] md:h-[16px] lg:h-[20px] w-[12px] md:w-[16px] lg:w-[16px]" />
                            <span className="text-[15px] md:text-[17px] text-[#000000] lg:text-[20px] font-[500]">Users Overview</span>
                        </div>
    
                        <div className="flex items-center justify-around gap-4 md:gap-20">
                            {data.map((dt) => (
                                <div key={dt.id} className="flex flex-col gap-1">
                                    <span className="text-[15px] md:text-[24px] text-[#2C2C2C] lg:text-[26.96px] font-[600]">{dt.number}</span>
                                    <span className="text-[10px] md:text-[10px] lg:text-[15.41px] text-[#030213] font-[400]">{dt.name}</span>
                                </div>
                            ))}
                        </div>
                    </div>
    
                </section>
  )
}

export default UserOverviews