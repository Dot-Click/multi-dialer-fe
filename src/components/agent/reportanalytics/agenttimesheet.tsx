import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { useEffect, useState } from "react";
import { useAgentTimesheetReport } from "@/hooks/useAgentTimesheetReport";

interface AgentTimeSheetProps {
  userId?: string;
}

const AgentTimeSheet: React.FC<AgentTimeSheetProps> = ({ userId }) => {
  const [showAllDatesButton, setShowAllDatesButton] = useState(false);
  const { data, loading, getAgentTimesheet } = useAgentTimesheetReport();

  useEffect(() => {
    getAgentTimesheet({ userId });
  }, [userId, getAgentTimesheet]);

  useEffect(() => {
    if (
      window.location.pathname === "/admin/reports-analytics" ||
      window.location.pathname === "/reports-analytics"
    ) {
      setShowAllDatesButton(true);
    } else {
      setShowAllDatesButton(false);
    }
  }, []);

  return (
    <div className="pb-3 px-3 min-h-screen flex flex-col gap-3">
      {/* Date Filter */}
      {showAllDatesButton && (
        <div className="flex items-center w-fit gap-[16px] border border-[#D8DCE1] rounded-[12px] px-[16px] h-[40px] cursor-pointer">
          <IoIosArrowBack className="text-[13px] text-[#71717A]" />
          <span className="text-[16px]">All Dates</span>
          <IoIosArrowForward className="text-[13px] text-[#71717A]" />
        </div>
      )}

      {/* Table Container */}
      <div className="bg-white overflow-hidden mt-2">
        <div className="overflow-x-auto md:overflow-x-visible">
          <table className="w-full text-sm text-left min-w-[600px] md:min-w-full">
            <thead className="bg-[#F7F7F7] text-[#0E1011]">
              <tr>
                <th className="px-3 py-2 text-[14px] font-medium border-b border-[#EBEDF0]">Date</th>
                <th className="px-3 py-2 text-[14px] font-medium border-b border-[#EBEDF0]">Agent</th>
                <th className="px-3 py-2 text-[14px] font-medium border-b border-[#EBEDF0]">Device</th>
                <th className="px-3 py-2 text-[14px] font-medium border-b border-[#EBEDF0]">Log In Time</th>
                <th className="px-3 py-2 text-[14px] font-medium border-b border-[#EBEDF0]">Log Out Time</th>
                <th className="px-3 py-2 text-[14px] font-medium border-b border-[#EBEDF0]">Time Logged</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {data.map((row, index) => (
                <tr key={row.id || index} className="hover:bg-gray-50 text-gray-800 border-b border-[#EBEDF0] last:border-none">
                  <td className="px-3 py-4 text-[14px] font-normal text-[#495057] whitespace-nowrap">{row.date}</td>
                  <td className="px-3 py-4 text-[14px] font-medium text-[#495057] whitespace-nowrap">{row.agent}</td>
                  <td className="px-3 py-4 text-[14px] font-normal text-[#495057] whitespace-nowrap">{row.device}</td>
                  <td className="px-3 py-4 text-[14px] font-normal text-[#495057] whitespace-nowrap">{row.logIn}</td>
                  <td className="px-3 py-4 text-[14px] font-normal text-[#495057] whitespace-nowrap">{row.logOut}</td>
                  <td className="px-3 py-4 text-[14px] font-normal text-[#495057] whitespace-nowrap">{row.timeLogged}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {loading && <div className="text-center py-4 text-[#495057]">Loading timesheet...</div>}
          {!loading && data.length === 0 && (
            <div className="text-center py-4 text-gray-500">No timesheet records found.</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentTimeSheet;