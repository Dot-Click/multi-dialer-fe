import { useState, useRef, useEffect } from "react";
import CallDetail from "@/components/agent/reportanalytics/calldetail";
import Session from "@/components/agent/reportanalytics/session";
import RecurringEvent from "@/components/agent/reportanalytics/recurringevent";
import AgentTimeSheet from "@/components/agent/reportanalytics/agenttimesheet";
// import Neighbourhood from "@/components/agent/reportanalytics/neighbourhood";
// import EmailStatus from "@/components/agent/reportanalytics/emailstatus";
// import Neighbourhood from "./neighbourhood";
// import PostingReport from "@/components/agent/reportanalytics/postingreport";
import CallRecording from "@/components/agent/reportanalytics/callrecording";
import exportarrowicon from "../../../assets/exportarrowicon.png";
import { FaChevronDown } from "react-icons/fa";

const dispositionOptions = [
  "All Result",
  "Hot",
  "Warm",
  "Cold",
  "Called",
  "Busy",
  "No Answer",
  "Call Back",
  "Do not call",
  "Not interested",
];

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

interface ReportDashboardProps {
  userId?: string;
}

const ReportDashboard: React.FC<ReportDashboardProps> = ({ userId }) => {
  const [openData, setOpenData] = useState("Call detail");
  const [selectedResult, setSelectedResult] = useState("All Result");
  const [isResultDropdownOpen, setIsResultDropdownOpen] = useState(false);
  const resultDropdownRef = useRef<HTMLDivElement>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handleExport = () => {
    if (!reportRef.current) return;

    const doc = new jsPDF("p", "mm", "a4");

    // Title
    doc.setFontSize(16);
    doc.text(`${openData} Report`, 14, 15);
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 22);

    // Find all tables in the report area
    const tables = reportRef.current.querySelectorAll("table");

    if (tables.length === 0) {
      // No table found — export a message
      doc.setFontSize(12);
      doc.text("No tabular data found in the current view.", 14, 35);
    } else {
      let startY = 28;
      tables.forEach((table, idx) => {
        // Extract headers
        const headerCells = table.querySelectorAll("thead th");
        const headers = Array.from(headerCells).map(
          (th) => (th as HTMLElement).innerText.trim()
        );

        // Extract rows
        const rows: string[][] = [];
        const bodyRows = table.querySelectorAll("tbody tr");
        bodyRows.forEach((row) => {
          const cells = row.querySelectorAll("td");
          if (cells.length > 0) {
            const rowData = Array.from(cells).map(
              (td) => (td as HTMLElement).innerText.trim()
            );
            rows.push(rowData);
          }
        });

        if (headers.length > 0 || rows.length > 0) {
          if (idx > 0) startY += 10;
          autoTable(doc, {
            head: headers.length > 0 ? [headers] : undefined,
            body: rows,
            startY,
            styles: { fontSize: 9, cellPadding: 3 },
            headStyles: { fillColor: [255, 202, 6], textColor: [0, 0, 0] },
            didDrawPage: (data: any) => {
              startY = data.cursor?.y ?? startY;
            },
          });
          startY = (doc as any).lastAutoTable?.finalY ?? startY + 10;
        }
      });
    }

    doc.save(`${openData}_report_${new Date().toLocaleDateString()}.pdf`);
  };

  const reportsData = [
    {
      id: 1,
      label: "Call detail",
      component: <CallDetail userId={userId} selectedResult={selectedResult} />,
    },
    { id: 2, label: "Session", component: <Session userId={userId} /> },
    {
      id: 3,
      label: "Call Recording",
      component: (
        <CallRecording userId={userId} selectedResult={selectedResult} />
      ),
    },
    { id: 4, label: "Recurring events", component: <RecurringEvent /> },
    // { id: 5, label: "Posting Report", component: <PostingReport /> },
    {
      id: 6,
      label: "Agent timesheet",
      component: <AgentTimeSheet userId={userId} />,
    },
    // { id: 7, label: "Email status", component: <EmailStatus /> },
    // {
    //   id: 8,
    //   label: "Neighborhood search updates",
    //   component: <Neighbourhood />,
    // },
    // { id: 8, label: "Neighborhood search updates", component: <Neighbourhood /> },
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
        {/* Left: Title + Disposition filter */}
        <div className="flex gap-5 items-center">
          <h2 className="text-[24px] font-medium text-[#17181B] dark:text-white whitespace-nowrap">
            Reports
          </h2>

          {/* Call Result Dropdown */}
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
        <button
          onClick={handleExport}
          className="flex items-center gap-2 text-[16px] font-medium text-[#495057] dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition whitespace-nowrap"
        >
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
            className={`px-[16px] py-[8px] text-[16px] font-medium rounded-[12px] transition whitespace-nowrap ${
              openData === rdata.label
                ? "bg-[#FFCA06] dark:text-black text-[#0E1011]"
                : "bg-[#F3F4F7] dark:bg-slate-700 text-[#495057] dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-slate-600"
            }`}
          >
            {rdata.label}
          </button>
        ))}
      </div>

      {/* Component Output — ref captures this for PDF export */}
      <div ref={reportRef} className="mt-4 w-full">
        {ActiveComponent}
      </div>
    </div>
  );
};

export default ReportDashboard;
