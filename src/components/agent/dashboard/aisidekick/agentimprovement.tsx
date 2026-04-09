
import { useImprovement } from "@/hooks/useAiSidekick";
import { Loader2 } from "lucide-react";

const AgentImprovement = () => {
    const { data, isLoading } = useImprovement();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-800 w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex items-center justify-center min-h-[160px]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    const currentPerf = data?.improvement.current || 0;
    const targetPerf = data?.improvement.target || 20;

    return (
        <div className="bg-white dark:bg-slate-800 w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px]">
            <h2 className="text-[20px] font-medium dark:text-white text-[#000000] mb-6">Agent Improvement Score</h2>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[14px] dark:text-gray-400 text-[#495057] font-medium">Current Performance</p>
                    <p className="text-[16px] font-medium dark:text-white text-[#000000] mt-1">+{currentPerf}%</p>
                </div>
                <div>
                    <p className="text-[14px] dark:text-gray-400 text-[#495057] font-medium">Target Performance</p>
                    <p className="text-[16px] font-medium dark:text-white text-[#000000] mt-1">+{targetPerf}%</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-full bg-[#EBEDF0] dark:bg-slate-700 rounded-[8px] h-10 overflow-hidden">
                    <div
                        className="bg-[#1EAC22] dark:bg-green-500 h-full rounded-[8px] transition-all duration-500"
                        style={{ width: `${currentPerf}%` }}
                    ></div>
                </div>
                <span className="font-medium text-[18px] dark:text-white text-[#000000]">{currentPerf}%</span>
            </div>
        </div>
    );
};

export default AgentImprovement;