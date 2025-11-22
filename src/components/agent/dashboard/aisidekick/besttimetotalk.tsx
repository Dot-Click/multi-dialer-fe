import AgentDialedTalkes from "@/components/charts/agentdialedtalkedchart"
import AnsweredChart from "@/components/charts/answeredchart"

const BestTimeToTalk = () => {
    const days = ["Sun", "Mon-Today", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return (
        <div className="bg-white rounded-[32px] flex flex-col gap-3 shadow-md p-[24px] w-full">
            <div>
                <h1 className="text-[20px] text-[#000000] font-[500]">Best Time To Call</h1>
            </div>
            <div className="flex gap-2 items-center lg:gap-4">
               {days.map((d, i) => (
    <span
        key={i}
        className={`text-[9px] md:text-[12px] px-2 py-1 lg:text-[14px] border cursor-pointer rounded-[8px] border-gray-300 font-[500] lg:px-[12px] lg:py-1.5
            ${d === "Mon-Today" ? "bg-[#0E1011] text-white" : "text-[#0E1011]"}
        `}
    >
        {d}
    </span>
))}

            </div>



            <div className="flex lg:flex-row flex-col justify-between">


                <div className="w-full lg:w-[48%] ">
                    <div className="w-full flex justify-between my-2 items-center">
                        <h1 className="text-[14px] md:text-[17px] lg:text-[16px] text-[#0E1011] font-[500] ">Dialed vs Talked</h1>
                        <div className="flex gap-11 items-center">
                            <div className="flex items-center gap-1.5">
                                <h1 className="bg-[#3DC269] h-2 w-2 rounded-full"></h1>
                                <span className="text-[10px] md:text-[13px] lg:text-[15px] font-[500]">Dialed</span>
                            </div>

                            <div className="flex items-center gap-1.5">
                                <h1 className="bg-[#FF7F3A]  h-2 w-2 rounded-full"></h1>
                                <span className="text-[10px] md:text-[13px] lg:text-[15px] font-[500]">Talked</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full">
                    <AgentDialedTalkes />
                </div>
                </div>


                

                <div className="w-full lg:w-[48%] ">
                    <div className="my-2">
                        <h1 className="text-[18px] font-[500] ">Answered %</h1>
                    </div>

                    <div>
                        <AnsweredChart />
                    </div>
                </div>

            </div>


        </div>
    )
}

export default BestTimeToTalk