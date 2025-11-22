import { IoIosArrowForward } from "react-icons/io";

const GoToCalender = () => {

    const today = [
        { id: 1, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-[#D43435]" },
        { id: 2, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-[#9400BD]" },
        { id: 3, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-[#37B5EF]" },
    ]

    const tomorrow = [
        { id: 1, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-[#3DC269]" },
        { id: 2, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-[#9400BD]" },
        { id: 3, name: "Demo Session – Product X", timeIn: "14:10", timeOut: "15:20", color: "border-[#F6BF26]" },
    ]



    return (
        <section className='bg-white  h-fit lg:h-[50vh]  flex flex-col gap-5 rounded-[32px] px-[24px] pt-[24px] pb-[32px]  w-full lg:w-[55%] '>
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-[14px] text-[#2B3034] font-[500]">Thursday</h1>
                    <h1 className="text-[20px] text-[#0E1011] font-[500]">September 08</h1>
                </div>
                <div className="flex gap-1 text-[#2B3034] items-center ">
                    <span className="text-[16px] font-[500]">Go To Calender</span>
                    <span ><IoIosArrowForward className="text-[19px] font-[400]" /></span>
                </div>
            </div>

            <div className="flex flex-col md:flex-row gap-8 lg:items-center lg:justify-between">

            <div className=" flex flex-col gap-2">
                <h1 className="text-[14px] font-[500] text-[rgb(73,80,87)]">Today</h1>
                <div className="flex flex-col gap-3">
                    {today.map((tday) => (
                        <div key={tday.id} className={` px-2 py-1 border-l-4 rounded ${tday.color}`}>
                            <h1 className="text-[16px] font-[500] text-[#0E1011]">{tday.name}</h1>
                            <h1 className="text-[14px] font-[400] text-[#848C94]">{tday.timeIn} - {tday.timeOut}</h1>
                        </div>
                    ))}
                </div>
            </div>

            <div  className=" flex flex-col gap-2">
                <h1 className="text-[12px] lg:text-[14px] font-[500] text-[#495057]">Tomorrow, September 09</h1>
                <div className="flex flex-col gap-3">
                    {tomorrow.map((tday) => (
                        <div key={tday.id} className={` px-2 py-1 border-l-4 rounded ${tday.color}`}>
                            <h1 className="text-[16px] font-[500] text-[#0E1011]">{tday.name}</h1>
                            <h1 className="text-[14px] font-[400] text-[#848C94]">{tday.timeIn} - {tday.timeOut}</h1>
                        </div>
                    ))}
                </div>
            </div>

</div>


        </section>
    )
}

export default GoToCalender;