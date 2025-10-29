import { IoIosArrowForward } from "react-icons/io";

const GoToCalender = () => {

    const today = [
        { id: 1, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-red-500" },
        { id: 2, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-purple-500" },
        { id: 3, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-sky-500" },
    ]

    const tomorrow = [
        { id: 1, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-yellow-500" },
        { id: 2, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-green-500" },
        { id: 3, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-orange-500" },
    ]



    return (
        <section className='bg-white flex flex-col gap-5 rounded-xl px-7 py-5 w-full md:w-[50%] '>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-[14px] font-[500]">Thursday</h1>
                    <h1 className="text-[20px] font-[500]">September 08</h1>
                </div>
                <div className="flex gap-1 items-center ">
                    <span className="text-[16px] font-[500]">Go To Calender</span>
                    <span ><IoIosArrowForward className="text-[19px] font-[400]" /></span>
                </div>
            </div>

            <div className="flex gap-8 h-[35vh] lg:h-[41vh] items-center justify-between">

            <div className=" flex flex-col gap-2">
                <h1 className="text-[14px] font-[600] text-[#495057]">Today</h1>
                <div className="flex flex-col gap-3">
                    {today.map((tday) => (
                        <div key={tday.id} className={` px-2 py-1 border-l-4 rounded ${tday.color}`}>
                            <h1 className="text-[15px] font-[600] text-gray-950">{tday.name}</h1>
                            <h1 className="text-[11px] font-[500] text-[#495057]">{tday.timeIn} - {tday.timeOut}</h1>
                        </div>
                    ))}
                </div>
            </div>

            <div  className=" flex flex-col gap-2">
                <h1 className="text-[12px] lg:text-[14px] font-[600] text-[#495057]">Tomorrow, September 09</h1>
                <div className="flex flex-col gap-3">
                    {tomorrow.map((tday) => (
                        <div key={tday.id} className={` px-2 py-1 border-l-4 rounded ${tday.color}`}>
                            <h1 className="text-[15px] font-[600] text-gray-950">{tday.name}</h1>
                            <h1 className="text-[11px] font-[500] text-[#495057]">{tday.timeIn} - {tday.timeOut}</h1>
                        </div>
                    ))}
                </div>
            </div>

</div>


        </section>
    )
}

export default GoToCalender