import { useSalesAgentsPerformance } from "@/hooks/useWorkspace";
import { Loader2 } from "lucide-react";

const AdminSalesAgent = () => {
  const { data: salesAgents, isLoading } = useSalesAgentsPerformance();

  if (isLoading) {
    return (
      <div className="bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] items-center justify-center rounded-4xl md:w-[50%] w-full">
        <Loader2 className="w-8 h-8 animate-spin text-yellow-500" />
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-4 rounded-4xl px-6 py-5 md:w-[50%]  w-full ">
      <h2 className="text-xl font-semibold text-gray-800 dark:text-white ">
        Sales Agents
      </h2>

      {/* Scrollable Container */}
      <div className="overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            {/* Table Header */}
            <tr className="text-[11px] text-gray-500 dark:text-gray-400">
              <th className="font-medium p-2  whitspace-nowrap ">Agent Name</th>
              <th className="font-medium p-2  whitspace-nowrap ">
                Total Calls
              </th>
              <th className="font-medium p-2  whitspace-nowrap ">
                Connected Calls
              </th>
              <th className="font-medium p-2  whitspace-nowrap ">
                Conversion Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {/* Table Body - Mapping over agent data */}
            {salesAgents && salesAgents.length > 0 ? (
              salesAgents.map((agent, index) => (
                <tr
                  key={index}
                  className="border-t border-gray-200 dark:border-slate-700"
                >
                  <td className="p-3 text-[11px] font-medium  text-gray-900 dark:text-white">
                    {agent.name}
                  </td>
                  <td className="p-3 text-[11px]  text-gray-700 dark:text-gray-300">
                    {agent.totalCalls}
                  </td>
                  <td className="p-3 text-[11px]  text-gray-700 dark:text-gray-300">
                    {agent.connectedCalls}
                  </td>
                  <td className="p-3 text-[11px]  text-gray-700 dark:text-gray-300">
                    {agent.conversionRate}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="p-10 text-center text-gray-500 text-sm">
                  No sales agent data available for this month.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSalesAgent;
