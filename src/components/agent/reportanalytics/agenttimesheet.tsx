import { useEffect } from "react";
import { useAgentTimesheetReport } from "@/hooks/useAgentTimesheetReport";

interface AgentTimeSheetProps {
  userId?: string;
}

const AgentTimeSheet: React.FC<AgentTimeSheetProps> = ({ userId }) => {
  const { data, loading, getAgentTimesheet } = useAgentTimesheetReport();

  useEffect(() => {
    getAgentTimesheet({ userId });
  }, [userId, getAgentTimesheet]);

  const displayData = data ?? [];

  return (
    <div className="pb-3 px-3 min-h-screen flex flex-col gap-3">
      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800 overflow-hidden mt-2">
        <div className="overflow-x-auto md:overflow-x-visible bg-white dark:bg-slate-800 rounded-xl overflow-hidden shadow-sm dark:shadow-none border border-gray-100 dark:border-slate-700">
          <table className="w-full text-sm text-left min-w-[600px] md:min-w-full">
            <thead className="bg-[#F7F7F7] dark:bg-slate-700 text-[#0E1011] dark:text-white">
              <tr>
                <th className="px-3 py-2 text-[14px] font-[500] border-b border-[#EBEDF0] dark:border-slate-700">
                  Date
                </th>
                <th className="px-3 py-2 text-[14px] font-[500] border-b border-[#EBEDF0] dark:border-slate-700">
                  Agent
                </th>
                {/* <th className="px-3 py-2 text-[14px] font-[500] border-b border-[#EBEDF0] dark:border-slate-700">
                  Device
                </th> */}
                <th className="px-3 py-2 text-[14px] font-[500] border-b border-[#EBEDF0] dark:border-slate-700">
                  Last Login
                </th>
                {/* <th className="px-3 py-2 text-[14px] font-[500] border-b border-[#EBEDF0] dark:border-slate-700">
                  Log Out Time
                </th>
                <th className="px-3 py-2 text-[14px] font-[500] border-b border-[#EBEDF0] dark:border-slate-700">
                  Time Logged
                </th> */}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {displayData.map((row: any, index: number) => (
                <tr
                  key={row.id || index}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-300 border-b border-[#EBEDF0] dark:border-slate-700 last:border-none"
                >
                  <td className="px-3 py-4 text-[14px] font-[400] text-[#495057] dark:text-gray-300 whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="px-3 py-4 text-[14px] font-[500] text-[#0E1011] dark:text-white whitespace-nowrap">
                    {row.agent}
                  </td>
                  {/* <td className="px-3 py-4 text-[14px] font-[400] text-[#495057] dark:text-gray-300 whitespace-nowrap">
                    {row.device}
                  </td> */}
                  <td className="px-3 py-4 text-[14px] font-[400] text-[#495057] dark:text-gray-300 whitespace-nowrap">
                    {row.logIn}
                  </td>
                  {/* <td className="px-3 py-4 text-[14px] font-[400] text-[#495057] dark:text-gray-300 whitespace-nowrap">
                    {row.logOut}
                  </td>
                  <td className="px-3 py-4 text-[14px] font-[400] text-[#495057] dark:text-gray-300 whitespace-nowrap">
                    {row.timeLogged}
                  </td> */}
                </tr>
              ))}
            </tbody>
          </table>

          {loading && (
            <div className="text-center py-4 text-[#495057] dark:text-gray-300">
              Loading timesheet...
            </div>
          )}
          {!loading && displayData.length === 0 && (
            <div className="text-center py-4 text-gray-500 dark:text-gray-400">
              No timesheet records found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentTimeSheet;
