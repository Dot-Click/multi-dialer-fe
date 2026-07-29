import { useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import AnalyticCard from "./analyticcard";
import dialingicon from "../../../assets/dialingicon.png";
import callsicon from "../../../assets/callsicon.png";
import contacticon from "../../../assets/contacticon.png";
import leadsicon from "../../../assets/leadsicon.png";
import appointmenticon from "../../../assets/appointmenticon.png";
import appointmentsecondicon from "../../../assets/appointmentsecondicon.png";
import callhricon from "../../../assets/callhricon.png";
import contacthricon from "../../../assets/contacthricon.png";
import callleadicon from "../../../assets/callleadicon.png";
import contactleadicon from "../../../assets/contactleadicon.png";
import timeicon from "../../../assets/timeicon.png";
import callappointmenticon from "../../../assets/callappointmenticon.png";
import contactappointment from "../../../assets/contactappointment.png";
import exportarrowicon from "../../../assets/exportarrowicon.png";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { addReportLogo } from "@/utils/pdfLogo";

interface AgentReport {
  dialingTime?: string;
  callsMade?: number;
  contacts?: number;
  totalLeads?: number;
  appointmentsSet?: number;
  appointmentsMet?: number;
  callsPerHour?: string | number;
  contactsPerHour?: string | number;
  callsPerLead?: string | number;
  contactsPerLead?: string | number;
  timePerAppointment?: string;
  callsPerAppointment?: string | number;
  contactsPerAppointment?: string | number;
  [key: string]: any;
}

interface AnalyticsDashboardProps {
  data: AgentReport | null;
  loading: boolean;
  onDateRangeChange?: (range: { startDate?: string; endDate?: string }) => void;
}

const DateRangeFilter: React.FC<{
  onChange: (range: { startDate?: string; endDate?: string }) => void;
}> = ({ onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [appliedLabel, setAppliedLabel] = useState("All Dates");

  const handleApply = () => {
    onChange({ startDate: startDate || undefined, endDate: endDate || undefined });
    setAppliedLabel(startDate && endDate ? `${startDate} - ${endDate}` : "All Dates");
    setIsOpen(false);
  };

  const handleClear = () => {
    setStartDate("");
    setEndDate("");
    setAppliedLabel("All Dates");
    onChange({ startDate: undefined, endDate: undefined });
    setIsOpen(false);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="flex items-center gap-2 border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-800 rounded-[12px] px-[16px] h-[40px] text-[14px] text-[#495057] dark:text-gray-200 whitespace-nowrap"
      >
        <span>{appliedLabel}</span>
        <FaChevronDown className="text-[11px] text-[#71717A] dark:text-gray-400" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 border border-[#D8DCE1] dark:border-slate-700 rounded-[12px] shadow-lg p-4 z-20">
          <div className="flex flex-col gap-3">
            <div>
              <label className="text-[12px] font-[500] text-[#495057] dark:text-gray-400 block mb-1">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-[8px] px-2 py-1.5 text-[13px]"
              />
            </div>
            <div>
              <label className="text-[12px] font-[500] text-[#495057] dark:text-gray-400 block mb-1">End Date</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full border border-[#D8DCE1] dark:border-slate-700 dark:bg-slate-900 dark:text-white rounded-[8px] px-2 py-1.5 text-[13px]"
              />
            </div>
            <div className="flex justify-between gap-2 mt-1">
              <button
                type="button"
                onClick={handleClear}
                className="text-[13px] font-[500] text-[#495057] dark:text-gray-400 hover:underline"
              >
                All Dates
              </button>
              <button
                type="button"
                onClick={handleApply}
                disabled={!startDate || !endDate}
                className="px-3 py-1.5 rounded-[8px] text-[13px] font-[500] bg-[#FFCA06] text-black disabled:opacity-40"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({
  data,
  loading,
  onDateRangeChange,
}) => {
  const stats = [
    {
      icon: dialingicon,
      label: "Dialing Time",
      value: data?.dialingTime ?? "0s",
    },
    {
      icon: callsicon,
      label: "Calls Made",
      value: String(data?.callsMade ?? 0),
    },
    {
      icon: contacticon,
      label: "Contacts Made",
      value: String(data?.contacts ?? 0),
    },
    {
      icon: leadsicon,
      label: "Leads",
      value: String(data?.totalLeads ?? 0),
    },
    {
      icon: appointmenticon,
      label: "Appointments Set",
      value: String(data?.appointmentsSet ?? 0),
    },
    {
      icon: appointmentsecondicon,
      label: "Appointments Met",
      value: String(data?.appointmentsMet ?? 0),
    },
    {
      icon: callhricon,
      label: "Calls/Hr",
      value: String(data?.callsPerHour ?? "0.00"),
    },
    {
      icon: contacthricon,
      label: "Contacts/Hr",
      value: String(data?.contactsPerHour ?? "0.00"),
    },
    {
      icon: callleadicon,
      label: "Calls/Lead",
      value: String(data?.callsPerLead ?? "0.00"),
    },
    {
      icon: contactleadicon,
      label: "Contacts/Lead",
      value: String(data?.contactsPerLead ?? "0.00"),
    },
    {
      icon: timeicon,
      label: "Time/Appointment",
      value: data?.timePerAppointment ?? "0s",
    },
    {
      icon: callappointmenticon,
      label: "Calls/Appointment",
      value: String(data?.callsPerAppointment ?? "0.00"),
    },
    {
      icon: contactappointment,
      label: "Contacts/Appointment",
      value: String(data?.contactsPerAppointment ?? "0.00"),
    },
  ];

  const handleExport = async () => {
    const doc = new jsPDF();
    // Platform logo (top-right)
    await addReportLogo(doc);
    doc.setFontSize(16);
    doc.text("Analytics Report", 14, 15);
    doc.setFontSize(10);
    doc.text(`Exported: ${new Date().toLocaleString()}`, 14, 22);

    autoTable(doc, {
      head: [["Metric", "Value"]],
      body: stats.map((stat) => [stat.label, stat.value]),
      startY: 28,
      headStyles: { fillColor: [255, 202, 6], textColor: [0, 0, 0] },
      styles: { fontSize: 10, cellPadding: 4 },
    });

    doc.save(`analytics_report_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-[24px] p-[24px] shadow-md w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mb-6">
        <div className="flex items-center gap-3">
          <h2 className="text-[24px] font-[500] text-[#17181B] dark:text-white">
            Analytics
          </h2>
          {onDateRangeChange && <DateRangeFilter onChange={onDateRangeChange} />}
        </div>

        <button
          onClick={handleExport}
          className="flex items-center gap-2 text-[16px] font-[500] text-[#495057] dark:text-gray-300 hover:text-gray-950 dark:hover:text-white transition"
        >
          <img src={exportarrowicon} alt="exportarrowicon" className="dark:invert" />
          <span>Export</span>
        </button>
      </div>

      {/* Stats Cards Grid */}
      <div
        className={`grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 transition-opacity duration-200 ${
          loading ? "opacity-50" : "opacity-100"
        }`}
      >
        {stats.map((stat, index) => (
          <AnalyticCard
            key={index}
            icon={stat.icon}
            label={stat.label}
            value={stat.value}
          />
        ))}
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
