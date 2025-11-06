import { useState } from "react";
import { HiDownload } from "react-icons/hi";
import CallDetail from "@/components/agent/reportanalytics/calldetail";
import Session from "@/components/agent/reportanalytics/session";
import RecurringEvent from "@/components/agent/reportanalytics/recurringevent";
import Neighbourhood from "@/components/agent/reportanalytics/neighbourhood";
import AgentTimeSheet from "@/components/agent/reportanalytics/agenttimesheet";

const Recording = () => <div className="mt-5">🎙 Recording Component</div>;
const PostingReport = () => <div className="mt-5">📄 Posting Report Component</div>;
const EmailStatus = () => <div className="mt-5">📧 Email Status Component</div>;

const ReportDashboard = () => {

  const [openData, setOpenData] = useState("Call detail");

  const reportsData = [
    { id: 1, label: "Call detail", component: <CallDetail /> },
    { id: 2, label: "Session", component: <Session /> },
    { id: 3, label: "Recording", component: <Recording /> },
    { id: 4, label: "Recurring events", component: <RecurringEvent /> },
    { id: 5, label: "Posting Report", component: <PostingReport /> },
    { id: 6, label: "Agent timesheet", component: <AgentTimeSheet /> },
    { id: 7, label: "Email status", component: <EmailStatus /> },
    { id: 8, label: "Neighborhood search updates", component: <Neighbourhood /> },
  ];

  // ✅ Jis label ka button click ho, uska component find karo
  const ActiveComponent = reportsData.find((rd) => rd.label === openData)?.component;

  return (
    <div className="bg-white rounded-2xl px-7 py-4 shadow-md">
      <div className="flex justify-between items-center mb-3">
        <h2 className="text-xl font-medium text-gray-800">Reports</h2>

        <button className="flex items-center space-x-1 text-base font-medium text-gray-700 cursor-pointer hover:text-gray-950">
          <HiDownload className="text-xl" />
          <span>Export</span>
        </button>
      </div>

      {/* Buttons */}
      <div className="flex flex-wrap items-center gap-2 border-b pb-3">
        {reportsData.map((rdata) => (
          <button
            key={rdata.id}
            onClick={() => setOpenData(rdata.label)}
            className={`px-3 py-2 text-sm font-medium rounded-2xl transition 
            ${openData === rdata.label ? "bg-yellow-400 text-gray-900" : "bg-gray-200 text-gray-700"}`}
          >
            {rdata.label}
          </button>
        ))}
      </div>

      {/* ✅ Selected Component Show */}
      <div>{ActiveComponent}</div>
    </div>
  );
};

export default ReportDashboard;
