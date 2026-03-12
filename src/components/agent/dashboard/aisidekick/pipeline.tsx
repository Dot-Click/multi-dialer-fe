import { useImprovement } from "@/hooks/useAiSidekick";
import { Loader2 } from "lucide-react";

const Pipeline = () => {
    const { data, isLoading } = useImprovement();

    if (isLoading) {
        return (
            <div className="bg-white dark:bg-slate-800 w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px] flex items-center justify-center min-h-[160px]">
                <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
            </div>
        );
    }

    const dealsAccelerated = data?.pipeline.dealsAccelerated || 0;
    const speedIncrease = data?.pipeline.speedIncrease || 0;
    const accelerationPercentage = data?.pipeline.accelerationPercentage || 0;

    return (
        <div className="bg-white dark:bg-slate-800 w-full shadow-sm rounded-[32px] px-[24px] pt-[24px] pb-[32px]">
            <h2 className="text-[20px] font-medium text-[#000000] dark:text-white mb-6">Pipeline Acceleration Index</h2>

            <div className="flex justify-between items-start mb-6">
                <div>
                    <p className="text-[14px] dark:text-gray-400 text-[#495057] font-medium">Deals Accelerated</p>
                    <p className="text-[16px] font-medium dark:text-white text-[#000000] mt-1">+{dealsAccelerated}</p>
                </div>
                <div>
                    <p className="text-[14px] dark:text-gray-400 text-[#495057] font-medium">Average Speed Increase</p>
                    <p className="text-[16px] font-medium dark:text-white text-[#000000] mt-1">+{speedIncrease}%</p>
                </div>
            </div>

            <div className="flex items-center gap-4">
                <div className="w-full bg-[#EBEDF0] dark:bg-slate-700 rounded-[8px] h-10 overflow-hidden">
                    <div
                        className="bg-[#1EAC22] dark:bg-green-500 h-full rounded-[8px] transition-all duration-500"
                        style={{ width: `${accelerationPercentage}%` }}
                    ></div>
                </div>
                <span className="font-medium text-[18px] dark:text-white text-[#000000]">{accelerationPercentage}%</span>
            </div>
        </div>
    );
};

export default Pipeline;