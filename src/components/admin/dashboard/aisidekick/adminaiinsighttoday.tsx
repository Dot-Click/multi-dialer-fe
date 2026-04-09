import vector from "@/assets/Vector.png";
import { useSidekickInsights } from "@/hooks/useAiSidekick";
import { Loader2 } from "lucide-react";

const AdminAiInsightToday = () => {
  const { data: insights, isLoading } = useSidekickInsights();

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-slate-800 rounded-xl flex items-center justify-center shadow-2xl px-[12px] py-[14px] lg:px-[20px] w-full lg:py-[15px] min-h-[120px]">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </section>
    );
  }

  const data = [
    { id: 1, name: "Calls analyzed", number: insights?.callsAnalyzed?.toString() || "0" },
    { id: 2, name: "Success prediction", number: insights?.successPrediction || "0%" },
    { id: 3, name: "Urgent follow-ups detected", number: insights?.urgentFollowUps?.toString() || "0" },
    { id: 4, name: "New Leads identified", number: insights?.newLeadsIdentified?.toString() || "0" },
  ];

  return (
    <section className="bg-white dark:bg-slate-800 rounded-xl flex flex-col gap-3 shadow-2xl px-[12px] py-[14px] lg:px-[20px] w-full lg:py-[15px]">
      <div className="flex items-center gap-1 lg:gap-2">
        <img
          src={vector}
          alt="vector icon"
          className="h-[13px] md:h-[16px] lg:h-[20px] w-[12px] md:w-[16px] lg:w-[16px] "
        />
        <span className="text-[12px] md:text-[17px] lg:text-[20px] font-medium dark:text-white">
          AI Insights on Teams Today
        </span>
      </div>

      <div className="flex items-center justify-between">
        {data.map((dt) => (
          <div key={dt.id} className="flex flex-col">
            <span className="text-[13px] md:text-[24px] lg:text-[40px] font-semibold dark:text-white">
              {dt.number}
            </span>
            <span className="text-[8px] md:text-[10px] lg:text-[14px] text-[#495057] dark:text-gray-400 font-medium">
              {dt.name}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminAiInsightToday;
