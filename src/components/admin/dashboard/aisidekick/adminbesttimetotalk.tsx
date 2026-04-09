import { useState } from "react";
import AgentDialedTalkes from "@/components/charts/agentdialedtalkedchart";
import AnsweredChart from "@/components/charts/answeredchart";
import { Loader2 } from "lucide-react";
import { useBestTimeToCall } from "@/hooks/useAiSidekick";

const AdminBestTimeToTalk = () => {
  const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const shortDayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const todayIndex = new Date().getDay();

  const [selectedIndex, setSelectedIndex] = useState(todayIndex);
  // const [data, setData] = useState<any>(null);
  // const [isLoading, setIsLoading] = useState(false);

  // For today, send "Today"; otherwise send the full day name
  const selectedDay = selectedIndex === todayIndex ? "Today" : dayNames[selectedIndex];

  const getDayLabel = (index: number) => {
    return index === todayIndex
      ? `${shortDayNames[index]}-Today`
      : shortDayNames[index];
  };

  const { data, isLoading } = useBestTimeToCall(selectedDay);


  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const res = await axios.get('/analytics/best-time-to-call', {
  //         params: { day: selectedDay }
  //       });
  //       setData(res.data?.data ?? res.data);
  //     } catch (error) {
  //       console.error("Error fetching best time to call data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, [selectedDay]);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl flex flex-col gap-3 shadow-2xl px-[12px] py-[14px] lg:px-[20px] w-full lg:py-[15px] min-h-[400px]">
      <div>
        <h1 className="text-[20px] font-[500] dark:text-white">
          Best Time To Call
        </h1>
      </div>

      <div className="flex gap-2 items-center lg:gap-4 overflow-x-auto pb-2 scrollbar-hide">
        {shortDayNames.map((_, i) => (
          <span
            key={i}
            onClick={() => setSelectedIndex(i)}
            className={`text-[9px] md:text-[13px] px-2 py-1 lg:text-[16px] border cursor-pointer rounded-lg whitespace-nowrap font-[500] lg:px-3 lg:py-1.5
              ${i === selectedIndex
                ? "bg-black dark:bg-slate-600 text-white border-black dark:border-slate-600"
                : "text-gray-950 dark:text-gray-300 border-gray-300 dark:border-slate-700 dark:hover:bg-slate-700"}
            `}
          >
            {getDayLabel(i)}
          </span>
        ))}
      </div>

      {isLoading ? (
        <div className="grow flex items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
        </div>
      ) : (
        <div className="flex lg:flex-row flex-col justify-between">
          <div className="w-full lg:w-[48%]">
            <div className="w-full flex justify-between items-center">
              <h1 className="text-[14px] md:text-[17px] lg:text-[18px] font-[500] dark:text-white">
                Dialed vs Talked
              </h1>
              <div className="flex gap-8 items-center">
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#3DC269] h-2 w-2 rounded-full inline-block" />
                  <span className="text-[10px] md:text-[13px] lg:text-[15px] font-[500] dark:text-gray-300">
                    Dialed
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="bg-[#FF7F3A] h-2 w-2 rounded-full inline-block" />
                  <span className="text-[10px] md:text-[13px] lg:text-[15px] font-[500] dark:text-gray-300">
                    Talked
                  </span>
                </div>
              </div>
            </div>
            <div className="w-full">
              <AgentDialedTalkes data={data?.dialedVsTalked} />
            </div>
          </div>

          <div className="w-full lg:w-[48%]">
            <div>
              <h1 className="text-[18px] font-[500] dark:text-white">
                Answered %
              </h1>
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

export default AdminBestTimeToTalk;