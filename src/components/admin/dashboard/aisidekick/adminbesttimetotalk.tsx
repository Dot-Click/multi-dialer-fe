import AgentDialedTalkes from "@/components/charts/agentdialedtalkedchart"
import AnsweredChart from "@/components/charts/answeredchart"

const AdminBestTimeToTalk = () => {
    const days = ["Sun", "Mon-Today", "Tue", "Wed", "Thu", "Fri", "Sat"]
    return (
        <div className="bg-white rounded-xl flex flex-col gap-3 shadow-2xl px-[12px] py-[14px] lg:px-[20px] w-full lg:py-[15px]">
            <div>
                <h1 className="text-[20px] font-[500]">Best Time To Call</h1>
            </div>
            <div className="flex gap-2 items-center lg:gap-4">
            {days.map((d, i) => (
    <span
        key={i}
        className={`text-[9px] md:text-[13px] px-2 py-1 lg:text-[16px] border cursor-pointer rounded-lg border-gray-300 font-[500] lg:px-3 lg:py-1.5
            ${d === "Mon-Today" ? "bg-black text-white" : "text-gray-950"}
        `}
    >
        {d}
    </span>
))}

            </div>



            <div className="flex lg:flex-row flex-col justify-between">


                <div className="w-full lg:w-[48%]">
                    <div className="w-full flex justify-between items-center">
                        <h1 className="text-[14px] md:text-[17px] lg:text-[18px] font-[500]">Dialed vs Talked</h1>
                        <div className="flex gap-8 items-center">
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


                

                <div className="w-full lg:w-[48%]">
                    <div>
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

export default AdminBestTimeToTalk