import { useState } from "react";
import CallStatisticChart from "@/components/charts/callstatisticschart";
import { useCallStatistics } from "@/hooks/useWorkspace";
import { Loader2 } from "lucide-react";

const AdminCallStatistics = () => {
  const date = ["Today", "Last 7 days", "Last 30 days"];
  const [active, setActive] = useState("Today");
  const { data: stats, isLoading } = useCallStatistics(active);

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-slate-800 flex h-fit lg:h-[75vh] flex-col items-center justify-center rounded-[32px] w-full ">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </section>
    );
  }

  const chartData = [
    { value: stats?.outcomes.interested || 0 },
    { value: stats?.outcomes.followup || 0 },
    { value: stats?.outcomes.noAnswer || 0 },
    { value: stats?.outcomes.notInterested || 0 },
    { value: stats?.outcomes.dnc || 0 },
  ];

  const followupPercent = stats?.goals.followup.target ? Math.round((stats.goals.followup.current / stats.goals.followup.target) * 100) : 0;
  const interestedPercent = stats?.goals.interested.target ? Math.round((stats.goals.interested.current / stats.goals.interested.target) * 100) : 0;

  return (
    <section className="bg-white dark:bg-slate-800 flex h-fit lg:h-[75vh] flex-col gap-5 rounded-[32px] px-[24px] pt-[24px] pb-[32px] w-full ">
      <div className="flex flex-col gap-3">
        <div>
          <h1 className="text-[20px] text-[#000000] dark:text-white font-[500]">
            Call Statistics
          </h1>
        </div>
        <div className="flex gap-3">
          {date.map((dt) => (
            <button
              key={dt}
              onClick={() => setActive(dt)}
              className={
                active === dt
                  ? "border px-2.5 rounded-md font-[500] cursor-pointer py-1.5 text-[14px] bg-[#0E1011] dark:bg-slate-600 text-white"
                  : "border px-2.5 rounded-md text-gray-950 dark:text-gray-300 font-[500] cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-700 py-1.5 text-[14px]"
              }
            >
              {dt}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between lg:pr-20 items-center">
        <div>
          <h1 className="text-[#495057] dark:text-gray-300 font-[500] text-[16px]">
            Total Calls
          </h1>
          <h4 className="text-[16px] text-[#000000] dark:text-white font-[500]">
            {stats?.totalCalls || 0}
          </h4>
        </div>
        <div>
          <h1 className="text-[#495057] dark:text-gray-300 font-[500] text-[16px]">
            Connection Rate
          </h1>
          <p className="flex gap-2 items-center">
            <span className="text-[16px] text-[#000000] dark:text-white font-[500]">
              {stats?.connectionRate || '0%'}
            </span>
            <span className="bg-[#1EAC221A] text-[12px] text-[#1EAC22] px-3 rounded-[100px] ">
              5%
            </span>
          </p>
        </div>
      </div>

      <div className="flex flex-col ">
        <h1 className="text-[16px] text-[#495057] dark:text-white font-[500]">
          Call Outcomes
        </h1>

        <div className="flex flex-col lg:flex-row gap-3 items-center">
          <div className="h-40 flex justify-center items-center">
            <CallStatisticChart data={chartData} />
          </div>

          <div className="flex gap-4 items-start">
            <div className="flex gap-3 flex-col">
              <span className="flex items-center gap-2">
                <h1 className="h-2 w-2 rounded-full bg-[#37B5EF]"></h1>
                <h1 className="text-[14px] font-[500] text-[#2B3034] dark:text-gray-200">
                  Interested: {stats?.outcomes.interested || 0}
                </h1>
              </span>
              <span className="flex items-center gap-2">
                <h1 className="h-2 w-2 rounded-full bg-[#9400BD]"></h1>
                <h1 className="text-[14px] font-[500] text-[#2B3034] dark:text-gray-200">
                  Follow-Up: {stats?.outcomes.followup || 0}
                </h1>
              </span>
              <span className="flex items-center gap-2">
                <h1 className="h-2 w-2 rounded-full bg-[#FF7F3A]"></h1>
                <h1 className="text-[14px] font-[500] text-[#2B3034] dark:text-gray-200">
                  No Answer: {stats?.outcomes.noAnswer || 0}
                </h1>
              </span>
            </div>
            <div className="flex gap-3 flex-col">
              <span className="flex items-center gap-2">
                <h1 className="h-2 w-2 rounded-full bg-[#F91E4A]"></h1>
                <h1 className="text-[14px] font-[500] text-[#2B3034] dark:text-gray-200">
                  Not Intersted: {stats?.outcomes.notInterested || 0}
                </h1>
              </span>
              <span className="flex items-center gap-2">
                <h1 className="h-2 w-2 rounded-full bg-[#EC7490]"></h1>
                <h1 className="text-[14px] font-[500] text-[#2B3034] dark:text-gray-200">
                  DNC: {stats?.outcomes.dnc || 0}
                </h1>
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <h1 className="text-[20px]  text-[#000000] dark:text-white font-[500]">
          Outcome Goals
        </h1>

        <div className="flex justify-between items-center">
          <div className="flex flex-col w-[45%] gap-2">
            <div className="flex justify-between items-center">
              <h1 className="text-[16px] text-[#2B3034] dark:text-gray-300 font-[500]">
                Follow-Up
              </h1>
              <h1 className="text-[14px] text-[#2B3034] dark:text-white font-[600]">
                {stats?.goals.followup.current}/{stats?.goals.followup.target}
              </h1>
            </div>
            <div className="w-full h-1.5 bg-[#EBEDF0] dark:bg-slate-700 rounded-md overflow-hidden">
              <div className="h-full bg-[#1EAC22] transition-all duration-500" style={{ width: `${Math.min(followupPercent, 100)}%` }}></div>
            </div>
          </div>

          <div className="flex flex-col  w-[45%] gap-2">
            <div className="flex justify-between items-center">
              <h1 className="text-[16px] text-[#2B3034] dark:text-gray-300 font-[500]">
                Interested Leads
              </h1>
              <h1 className="text-[14px] text-[#2B3034] dark:text-white font-[600]">
                {stats?.goals.interested.current}/{stats?.goals.interested.target}
              </h1>
            </div>
            <div className="w-full h-1.5 bg-[#EBEDF0] dark:bg-slate-700 rounded-md overflow-hidden">
              <div className="h-full bg-[#1EAC22] transition-all duration-500" style={{ width: `${Math.min(interestedPercent, 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AdminCallStatistics;
