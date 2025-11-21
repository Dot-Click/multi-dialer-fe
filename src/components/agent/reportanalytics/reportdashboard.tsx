import { useState } from "react";
import { HiDownload } from "react-icons/hi";
import CallDetail from "@/components/agent/reportanalytics/calldetail";
import Session from "@/components/agent/reportanalytics/session";
import RecurringEvent from "@/components/agent/reportanalytics/recurringevent";
import Neighbourhood from "@/components/agent/reportanalytics/neighbourhood";
import AgentTimeSheet from "@/components/agent/reportanalytics/agenttimesheet";
import PostingReport from "@/components/agent/reportanalytics/postingreport";
import EmailStatus from "@/components/agent/reportanalytics/emailstatus";
import CallRecording from "@/components/agent/reportanalytics/callrecording";
import exportarrowicon from "../../../assets/exportarrowicon.png"


const ReportDashboard = () => {
  const [openData, setOpenData] = useState("Call detail");

  const reportsData = [
    { id: 1, label: "Call detail", component: <CallDetail /> },
    { id: 2, label: "Session", component: <Session /> },
    { id: 3, label: "Call Recording", component: <CallRecording /> },
    { id: 4, label: "Recurring events", component: <RecurringEvent /> },
    { id: 5, label: "Posting Report", component: <PostingReport /> },
    { id: 6, label: "Agent timesheet", component: <AgentTimeSheet /> },
    { id: 7, label: "Email status", component: <EmailStatus /> },
    { id: 8, label: "Neighborhood search updates", component: <Neighbourhood /> },
  ];

  const ActiveComponent = reportsData.find((rd) => rd.label === openData)?.component;

  return (
    <div className="bg-white rounded-[24px] p-[24px] shadow-md w-full">

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 mb-4">
      <h2 className="text-[24px] font-[500] text-[#17181B]">
                        Reports
                    </h2>

        <button className="flex items-center gap-2 text-[16px] font-[500] text-[#495057] hover:text-gray-950 transition">
                    <img src={exportarrowicon} alt="exportarrowicon" className=""/>
                 <span>Export</span>
                </button>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 border-b pb-3">
        {reportsData.map((rdata) => (
          <button
            key={rdata.id}
            onClick={() => setOpenData(rdata.label)}
            className={`px-[16px] py-[8px] text-[16px] font-[500] rounded-[12px] transition whitespace-nowrap
            ${openData === rdata.label ? "bg-[#FFCA06] text-[#0E1011]" : "bg-[#F3F4F7] text-[#495057] hover:bg-gray-300"}`}
          >
            {rdata.label}
          </button>
        ))}
      </div>

      {/* Component Output */}
      <div className="mt-4 w-full">
        {ActiveComponent}
      </div>
    </div>
  );
};

export default ReportDashboard;
