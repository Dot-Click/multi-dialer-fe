import { useState, useRef, useEffect } from "react";
import CallDetail from "@/components/agent/reportanalytics/calldetail";
import Session from "@/components/agent/reportanalytics/session";
import RecurringEvent from "@/components/agent/reportanalytics/recurringevent";
import Neighbourhood from "@/components/agent/reportanalytics/neighbourhood";
import AgentTimeSheet from "@/components/agent/reportanalytics/agenttimesheet";
import PostingReport from "@/components/agent/reportanalytics/postingreport";
import EmailStatus from "@/components/agent/reportanalytics/emailstatus";
import CallRecording from "@/components/agent/reportanalytics/callrecording";
import exportarrowicon from "../../../assets/exportarrowicon.png";
import { FaChevronDown } from "react-icons/fa";

const dispositionOptions = [
  "All Result",
  "Hot",
  "Warm",
  "Cold",
  "Call Back",
  "Do not call",
  "Not interested",
];

interface ReportDashboardProps {
  userId?: string;
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ userId }) => {
  const [openData, setOpenData] = useState("Call detail");
  const [selectedResult, setSelectedResult] = useState("All Result");
  const [isResultDropdownOpen, setIsResultDropdownOpen] = useState(false);
  const resultDropdownRef = useRef<HTMLDivElement>(null);

  const reportsData = [
    { id: 1, label: "Call detail", component: <CallDetail userId={userId} /> },
    { id: 2, label: "Session", component: <Session userId={userId} /> },
    { id: 3, label: "Call Recording", component: <CallRecording /> },
    { id: 4, label: "Recurring events", component: <RecurringEvent /> },
    { id: 5, label: "Posting Report", component: <PostingReport /> },
    { id: 6, label: "Agent timesheet", component: <AgentTimeSheet /> },
    { id: 7, label: "Email status", component: <EmailStatus /> },
    {
      id: 8,
      label: "Neighborhood search updates",
      component: <Neighbourhood />,
    },
  ];

  const ActiveComponent = reportsData.find(
    (rd) => rd.label === openData,
  )?.component;

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        resultDropdownRef.current &&
        !resultDropdownRef.current.contains(event.target as Node)
      ) {
        setIsResultDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[24px] p-[24px] shadow-md w-full">
      {/* Header with Filters in Horizontal Layout */}
      <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4 mb-4">
        {/* Left: Title */}
        <h2 className="text-[24px] font-[500] text-[#17181B] dark:text-white whitespace-nowrap">
          Reports
        </h2>

        {/* Middle: Filters */}
        <div className="flex flex-wrap items-center gap-3 flex-1 lg:justify-center">
          <div className="border border-[#D8DCE1] dark:border-slate-700 rounded-[12px] px-[16px] h-[40px] flex justify-between items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 min-w-[180px]">
            <span className="text-[16px] text-[#495057] dark:text-gray-300">
              Select Date Range
            </span>
            <FaChevronDown className="text-[13px] text-[#71717A] dark:text-gray-400" />
          </div>

          <div className="border border-[#D8DCE1] dark:border-slate-700 rounded-[12px] px-[16px] h-[40px] flex justify-between items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 min-w-[120px]">
            <span className="text-[16px] text-[#495057] dark:text-gray-300">
              All Days
            </span>
            <FaChevronDown className="text-[13px] text-[#71717A] dark:text-gray-400" />
          </div>

          <div className="relative" ref={resultDropdownRef}>
            <div
              className="border border-[#D8DCE1] dark:border-slate-700 rounded-[12px] px-[16px] h-[40px] flex justify-between items-center gap-2 cursor-pointer bg-white dark:bg-slate-800 min-w-[160px]"
              onClick={() => setIsResultDropdownOpen(!isResultDropdownOpen)}
            >
              <span className="text-[16px] text-[#495057] dark:text-gray-300">
                {selectedResult}
              </span>
              <FaChevronDown
                className={`text-[13px] text-[#71717A] dark:text-gray-400 transition-transform ${isResultDropdownOpen ? "rotate-180" : ""}`}
              />
            </div>

            {isResultDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 bg-white dark:bg-slate-800 border border-[#D8DCE1] dark:border-slate-700 rounded-[12px] shadow-lg z-50 min-w-[160px] max-h-[300px] overflow-y-auto">
                {dispositionOptions.map((option) => (
                  <div
                    key={option}
                    onClick={() => {
                      setSelectedResult(option);
                      setIsResultDropdownOpen(false);
                    }}
                    className={`px-[16px] py-[10px] text-[16px] cursor-pointer hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors ${
                      selectedResult === option
                        ? "bg-gray-50 dark:bg-slate-700 font-medium text-[#17181B] dark:text-white"
                        : "text-[#495057] dark:text-gray-300"
                    } ${option === dispositionOptions[0] ? "border-b border-gray-200 dark:border-slate-700" : ""}`}
                  >
                    {option}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right: Export Button */}
        <button className="flex items-center gap-2 text-[16px] font-[500] text-[#495057] dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition whitespace-nowrap">
          <img
            src={exportarrowicon}
            alt="exportarrowicon"
            className="dark:invert"
          />
          <span>Export</span>
        </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b dark:border-slate-700 pb-3 mb-4">
        {reportsData.map((rdata) => (
          <button
            key={rdata.id}
            onClick={() => setOpenData(rdata.label)}
            className={`px-[16px] py-[8px] text-[16px] font-[500] rounded-[12px] transition whitespace-nowrap
            ${openData === rdata.label ? "bg-[#FFCA06] dark:text-black text-[#0E1011]" : "bg-[#F3F4F7] dark:bg-slate-700 text-[#495057] dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"}`}
          >
            {rdata.label}
          </button>
        ))}
      </div>

      {/* Component Output */}
      <div className="mt-4 w-full">{ActiveComponent}</div>
    </div>
  );
};

export default ReportDashboard;
