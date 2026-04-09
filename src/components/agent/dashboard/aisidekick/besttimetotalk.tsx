import { useState } from "react";
import AgentDialedTalkes from "@/components/charts/agentdialedtalkedchart";
import AnsweredChart from "@/components/charts/answeredchart";
import { useBestTimeToCall } from "@/hooks/useAiSidekick";
import { Loader2 } from "lucide-react";

const BestTimeToTalk = () => {
    const todayIndex = new Date().getDay();
    const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

    // Initialize with today
    const [activeDay, setActiveDay] = useState(dayNames[todayIndex]);

    const { data, isLoading } = useBestTimeToCall(activeDay);

    const getDayLabel = (day: string, index: number) => {
        const shortName = shortDayNames[dayNames.indexOf(day)];
        return index === todayIndex ? `${shortName}-Today` : shortName;
    };

    return (
        <div className="bg-white dark:bg-slate-800 rounded-[32px] flex flex-col gap-3 shadow-md p-[24px] w-full min-h-[400px]">
            <div>
                <h1 className="text-[20px] text-[#000000] dark:text-white font-medium">
                    Best Time To Call
                </h1>
            </div>
            <div className="flex gap-2 items-center lg:gap-4 overflow-x-auto pb-2 scrollbar-hide">
                {dayNames.map((day, i) => (
                    <span
                        key={i}
                        onClick={() => setActiveDay(day)}
                        className={`text-[9px] md:text-[12px] px-3 py-1.5 lg:text-[14px] border cursor-pointer rounded-[8px] transition-colors whitespace-nowrap font-medium
            ${activeDay === day
                                ? "bg-[#0E1011] text-white border-[#0E1011] dark:bg-slate-700 dark:border-slate-600"
                                : "text-[#0E1011] dark:text-white border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-slate-700"}
        `}
                    >
                        {getDayLabel(day, i)}
                    </span>
                ))}
            </div>

            {isLoading ? (
                <div className="grow flex items-center justify-center">
                    <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
                </div>
            ) : (
                <div className="flex lg:flex-row flex-col justify-between">
                    <div className="w-full lg:w-[48%] ">
                        <div className="w-full flex justify-between my-2 items-center">
                            <h2 className="text-[14px] md:text-[17px] lg:text-[16px] text-[#0E1011] dark:text-white font-medium ">
                                Dialed vs Talked
                            </h2>
                            <div className="flex gap-4 md:gap-11 items-center">
                                <div className="flex items-center gap-1.5">
                                    <h3 className="bg-[#3DC269] dark:bg-green-500 h-2 w-2 rounded-full"></h3>
                                    <span className="text-[10px] md:text-[13px] lg:text-[15px] font-medium dark:text-gray-400">
                                        Dialed
                                    </span>
                                </div>

                                <div className="flex items-center gap-1.5">
                                    <h3 className="bg-[#FF7F3A] dark:bg-orange-500  h-2 w-2 rounded-full"></h3>
                                    <span className="text-[10px] md:text-[13px] lg:text-[15px] font-medium dark:text-gray-400">
                                        Talked
                                    </span>
                                </div>
                            </div>
                        </div>
                        <div className="w-full">
                            <AgentDialedTalkes data={data?.dialedVsTalked} />
                        </div>
                    </div>

                    <div className="w-full lg:w-[48%] ">
                        <div className="my-2">
                            <h2 className="text-[18px] dark:text-white font-medium ">Answered %</h2>
                        </div>

                        <div>
                            <AnsweredChart data={data?.answeredPercentage} />
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BestTimeToTalk;
