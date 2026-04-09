import vector from "@/assets/Vector.png"
import { useSidekickInsights } from "@/hooks/useAiSidekick"
import { Loader2 } from "lucide-react"

const AiInsightToday = () => {
    const { data: insights, isLoading } = useSidekickInsights();

    if (isLoading) {
        return (
            <section className="bg-white dark:bg-slate-800 rounded-[32px] flex items-center justify-center shadow-md px-[12px] py-[14px] lg:px-[24px] w-full lg:pt-[24px] lg:pb-[32px] min-h-[140px]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </section>
        );
    }

    const data = [
        { id: 1, name: "Calls analyzed", number: insights?.callsAnalyzed?.toString() || "0" },
        { id: 2, name: "Success prediction", number: insights?.successPrediction || "0%" },
        { id: 3, name: "Urgent follow-ups detected", number: insights?.urgentFollowUps?.toString() || "0" },
    ]

    return (
        <section className="bg-white dark:bg-slate-800 rounded-[32px] flex flex-col gap-3 shadow-md px-[12px] py-[14px] lg:px-[24px] w-full lg:pt-[24px] lg:pb-[32px]">
            <div className="flex items-center gap-1 lg:gap-2">
                <img src={vector} alt="vector icon" className="h-[13px] md:h-[16px] lg:h-[20px] w-[12px] md:w-[16px] lg:w-[16px]" />
                <span className="text-[12px] md:text-[17px] lg:text-[20px] dark:text-white text-[#000000] font-medium">AI Insights Today</span>
            </div>

            <div className="flex items-center w-full lg:w-[85%] justify-between ">
                {data.map((dt)=>(
                    <div key={dt.id} className="flex text-[#000000] dark:text-white flex-col">
                        <span className="text-[13px] md:text-[24px] lg:text-[40px] font-semibold">{dt.number}</span>
                        <span className="text-[8px] dark:text-gray-400 text-[#495057] md:text-[10px] lg:text-[14px] font-medium">{dt.name}</span>

                    </div>
                ))}
            </div>

        </section>
    )
}

export default AiInsightToday