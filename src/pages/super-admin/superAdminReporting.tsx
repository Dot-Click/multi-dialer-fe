import { useState, useRef } from "react";
import { IoFilterOutline } from "react-icons/io5";
import downarrow from "@/assets/downarrow.png";
import { PiDownloadSimpleBold } from "react-icons/pi";
import BussinessOverviews from "@/components/super-admin/reporting/bussinessOverviews";
import RevenueByPlan from "@/components/super-admin/reporting/revenueByPlan";
import SubscriptionDistribution from "@/components/super-admin/home/subscriptionDistribution";
// import MonthlyRecurring from "@/components/super-admin/reporting/monthlyRecurring";
// import SubscriptionGrowth from "@/components/super-admin/reporting/subscriptionGrowth";
// import Data from "@/components/super-admin/reporting/data";
// import SubscritpionSecond from "@/components/super-admin/reporting/subscritpionSecond";
import UserUsageOverview from "@/components/super-admin/reporting/userUsageOverview";
import { useAppSelector } from "@/store/hooks";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const SuperAdminReporting = () => {
  // States for Dates
  const [fromDate, setFromDate] = useState("Select Date");
  const [toDate, setToDate] = useState("Select Date");

  // Refs for hidden date inputs
  const fromInputRef = useRef<HTMLInputElement>(null);
  const toInputRef = useRef<HTMLInputElement>(null);

  // States for Dropdowns
  const [selectedPlan, setSelectedPlan] = useState("All Plans");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [searchTerm, setSearchTerm] = useState("");
  const [planOpen, setPlanOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  // Options
  const planOptions = [
    "All Plans",
    "Basic",
    "Professional",
    "Enterprise",
    "Custom",
  ];
  const statusOptions = [
    "All Status",
    "Active",
    "Pending",
    "Suspended",
    "Expired",
  ];

  // Date formatting helper (YYYY-MM-DD to MM/DD/YYYY)
  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const [year, month, day] = dateStr.split("-");
    return `${month}/${day}/${year}`;
  };

  const { subscriptions } = useAppSelector((state) => state.subscriptions);

  const filteredData = subscriptions.filter((item) => {
    const fullName = item.user?.fullName || "";
    const email = item.user?.email || "";
    const matchesSearch =
      fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.plan.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan =
      !selectedPlan ||
      selectedPlan === "All Plans" ||
      item.plan.toUpperCase() === selectedPlan.toUpperCase();

    const matchesStatus =
      !selectedStatus ||
      selectedStatus === "All Status" ||
      item.status.toUpperCase() === selectedStatus.toUpperCase();

    let matchesDate = true;
    if (fromDate && toDate && fromDate !== "Select Date" && toDate !== "Select Date") {
      const createdDate = new Date(item.createdAt);
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999);
      matchesDate = createdDate >= start && createdDate <= end;
    }

    return matchesSearch && matchesPlan && matchesStatus && matchesDate;
  });

  const handleExportCSV = () => {
    const headers = ["User Name", "Plan", "Agent Count", "MRRR", "Status", "Date"];
    const csvRows = [
      headers.join(","),
      ...filteredData.map((row) => [
        `"${row.user?.fullName || "N/A"}"`,
        `"${row.plan}"`,
        row.usersCount,
        row.amount || 0,
        `"${row.status}"`,
        `"${new Date(row.createdAt).toLocaleDateString()}"`,
      ].join(",")),
    ];

    const blob = new Blob([csvRows.join("\n")], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `reporting_${new Date().toLocaleDateString()}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.text("User Usage Overview Report", 14, 15);
    
    const tableData = filteredData.map((row) => [
      row.user?.fullName || "N/A",
      row.plan,
      row.usersCount,
      `$${row.amount || 0}`,
      row.status,
      new Date(row.createdAt).toLocaleDateString(),
    ]);

    autoTable(doc, {
      head: [["User Name", "Plan", "Agent Count", "MRRR", "Status", "Date"]],
      body: tableData,
      startY: 20,
    });

    doc.save(`reporting_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <section className="w-full min-h-screen flex flex-col gap-2 px-6 py-6 outfit bg-[#F5F6FA] dark:bg-slate-900">
      <div className="flex justify-between items-center mb-2">
        <div className="flex flex-col gap-4 w-full">
          <h1 className="text-[#2C2C2C] dark:text-white text-[20px] md:text-[26px] lg:text-[32px] font-[500]">
            Reporting
          </h1>

          <button className="bg-[#FFFFFF] dark:bg-slate-800 w-fit text-[#27272A] dark:text-white flex items-center justify-center gap-2 border text-[16px] font-[500] work-sans border-[#D8DCE1] dark:border-slate-600 rounded-[12px] py-[10px] px-[14px]">
            <span>
              <IoFilterOutline />
            </span>
            <span>Filter</span>
          </button>

          <div className="flex md:items-center md:flex-row flex-col md:justify-between gap-3">
            <div className="flex flex-col md:flex-row md:items-center gap-3">
              {/* FROM DATE */}
              <div className="flex items-center gap-2">
                <h1 className="text-[#000000] dark:text-white text-[18px] font-[500]">
                  From:
                </h1>
                <div className="relative">
                  <button
                    onClick={() => fromInputRef.current?.showPicker()}
                    className="bg-[#FFFFFF] dark:bg-slate-800 text-[#0E1011] dark:text-white work-sans font-[500] text-[16px] py-[6px] px-[20px] rounded-[12px] border border-[#EBEDF0] dark:border-slate-600 text-center min-w-[120px]"
                  >
                    {fromDate}
                  </button>
                  <input
                    type="date"
                    ref={fromInputRef}
                    className="absolute opacity-0 pointer-events-none inset-0"
                    onChange={(e) => setFromDate(formatDate(e.target.value))}
                  />
                </div>
              </div>

              {/* TO DATE */}
              <div className="flex items-center gap-2">
                <h1 className="text-[#000000] dark:text-white text-[18px] font-[500]">
                  To:
                </h1>
                <div className="relative">
                  <button
                    onClick={() => toInputRef.current?.showPicker()}
                    className="bg-[#FFFFFF] dark:bg-slate-800 text-[#0E1011] dark:text-white work-sans font-[500] text-[16px] py-[6px] px-[20px] rounded-[12px] border border-[#EBEDF0] dark:border-slate-600 text-center min-w-[120px]"
                  >
                    {toDate}
                  </button>
                  <input
                    type="date"
                    ref={toInputRef}
                    className="absolute opacity-0 pointer-events-none inset-0"
                    onChange={(e) => setToDate(formatDate(e.target.value))}
                  />
                </div>
              </div>

              {/* ALL PLANS DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setPlanOpen(!planOpen);
                    setStatusOpen(false);
                  }}
                  className="bg-[#F2F2F2] dark:bg-slate-800 px-3 py-2 h-[40px] flex rounded-[11.56px] w-[150px] justify-between items-center gap-2"
                >
                  <span className="text-[#030213] dark:text-white text-[15.41px] font-[400]">
                    {selectedPlan}
                  </span>
                  <img
                    src={downarrow}
                    alt="arrow"
                    className={`h-1.5 object-contain dark:invert transition-transform ${planOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {planOpen && (
                  <div className="absolute top-[45px] left-0 w-full bg-white dark:bg-slate-800 shadow-lg rounded-[11.56px] z-[100] border border-gray-100 dark:border-slate-600 overflow-hidden">
                    {planOptions.map((opt) => (
                      <div
                        key={opt}
                        className="px-4 py-2 hover:bg-[#F2F2F2] dark:hover:bg-slate-700 cursor-pointer text-[14px] text-[#030213] dark:text-white"
                        onClick={() => {
                          setSelectedPlan(opt);
                          setPlanOpen(false);
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ALL STATUS DROPDOWN */}
              <div className="relative">
                <button
                  onClick={() => {
                    setStatusOpen(!statusOpen);
                    setPlanOpen(false);
                  }}
                  className="bg-[#F2F2F2] dark:bg-slate-800 px-3 py-2 h-[40px] flex rounded-[11.56px] w-[150px] justify-between items-center gap-2"
                >
                  <span className="text-[15.41px] text-[#030213] dark:text-white font-[400]">
                    {selectedStatus}
                  </span>
                  <img
                    src={downarrow}
                    alt="arrow"
                    className={`h-1.5 object-contain dark:invert transition-transform ${statusOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {statusOpen && (
                  <div className="absolute top-[45px] left-0 w-full bg-white dark:bg-slate-800 shadow-lg rounded-[11.56px] z-[100] border border-gray-100 dark:border-slate-600 overflow-hidden">
                    {statusOptions.map((opt) => (
                      <div
                        key={opt}
                        className="px-4 py-2 hover:bg-[#F2F2F2] dark:hover:bg-slate-700 cursor-pointer text-[14px] text-[#030213] dark:text-white"
                        onClick={() => {
                          setSelectedStatus(opt);
                          setStatusOpen(false);
                        }}
                      >
                        {opt}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Export Buttons */}
            <div className="flex items-center gap-3 lg:ml-7 work-sans">
              <button 
                onClick={handleExportCSV}
                className="bg-[#EBEDF0] dark:bg-slate-700 text-[#0E1011] dark:text-white px-[24px] py-2 rounded-[12px] flex gap-2 items-center justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
              >
                <span className="text-[13px] md:text-[13.5px] lg:text-[14px] xl:text-[16px] font-[500] whitespace-nowrap">
                  Export CSV
                </span>
              </button>
              <button 
                onClick={handleExportPDF}
                className="bg-[#FFCA06] whitespace-nowrap text-[#000000] px-[24px] py-2 rounded-[12px] flex gap-2 items-center justify-center cursor-pointer hover:bg-yellow-500 transition-colors"
              >
                <span className="text-[13px] md:text-[13.5px] lg:text-[14px] xl:text-[16px] font-[500]">
                  <PiDownloadSimpleBold />
                </span>
                <span className="text-[13px] md:text-[13.5px] lg:text-[14px] xl:text-[16px] font-[500]">
                  Export PDF
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Content Components */}
      <BussinessOverviews />
      <div className="flex gap-3 flex-col md:flex-row justify-start items-center">
        <RevenueByPlan />
        <SubscriptionDistribution />
      </div>
      {/* <div className="flex gap-3 flex-col md:flex-row justify-start items-center">
        <MonthlyRecurring />
        <SubscriptionGrowth />
      </div>
      <div className="flex gap-3 flex-col md:flex-row justify-start items-center">
        <Data />
        <SubscritpionSecond />
      </div> */}
      <UserUsageOverview
        fromDate={fromDate}
        toDate={toDate}
        selectedPlan={selectedPlan}
        selectedStatus={selectedStatus}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />
      {/* <GeneratingReports />  */}
    </section>
  );
};

export default SuperAdminReporting;
