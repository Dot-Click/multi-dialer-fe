import { useAuditLogs } from "@/hooks/useSystemSettings";
import { Loader2 } from "lucide-react";
import moment from "moment";

const AdminRecentActivity = () => {
  const { data: audits, isLoading } = useAuditLogs();

  if (isLoading) {
    return (
      <section className="bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] items-center justify-center rounded-4xl md:w-[50%] w-full ">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </section>
    );
  }

  const recentActivity = audits || [];

  return (
    <section className="bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-5 rounded-4xl px-6 py-5 md:w-[50%]  w-full ">
      <div className="flex flex-col justify-between gap-1.5">
        <h1 className="text-[20px] font-medium dark:text-white">
          Recent Activity
        </h1>
      </div>

      <div className="flex flex-col gap-5  overflow-auto custom-scrollbar">
        {recentActivity.length > 0 ? (
          recentActivity.map((log) => (
            <div
              key={log.id}
              className="flex mx-2 rounded-md border-b gap-2 items-center border-gray-200 dark:border-slate-700"
            >
              <div className="flex flex-col gap-1.5 justify-between w-full">
                <h1 className=" text-[10px] md:text-[14px] font-medium text-gray-950 dark:text-white">
                  {log.action} <span className="text-gray-400 text-[12px]">({log.user?.fullName})</span>
                </h1>
                <div className="flex items-center gap-2">
                  <h1 className="text-[9px] md:text-[12px] font-normal text-[#495057] dark:text-gray-400">
                    {moment(log.createdAt).format("MM/DD/YYYY")}
                  </h1>
                  <h1 className="text-[9px] md:text-[12px] font-normal text-[#495057] dark:text-gray-400">
                    {moment(log.createdAt).format("hh:mm:ss A")}
                  </h1>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-10 text-gray-500">No recent activity found.</div>
        )}
      </div>
    </section>
  );
};

export default AdminRecentActivity;
