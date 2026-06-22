import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBillingReportDetail } from "@/store/slices/reportsSlice";
import type { RootState, AppDispatch } from "@/store/store";
import Loader from "@/components/common/Loader";
import searchIcon from "@/assets/searchIcon.png";
import downarrow from "@/assets/downarrow.png";

const SuperAdminDetailedBilling = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { billingReportDetail, billingLoading } = useSelector(
    (state: RootState) => state.reports
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("All Plans");
  const [selectedStatus, setSelectedStatus] = useState("All Status");
  const [planOpen, setPlanOpen] = useState(false);
  const [statusOpen, setStatusOpen] = useState(false);

  useEffect(() => {
    dispatch(getBillingReportDetail());
  }, [dispatch]);

  // Derive plan and status options from actual data
  const planOptions = useMemo(() => {
    const unique = Array.from(
      new Set((billingReportDetail || []).map((r) => r.plan).filter(Boolean))
    );
    return ["All Plans", ...unique];
  }, [billingReportDetail]);

  const statusOptions = useMemo(() => {
    const unique = Array.from(
      new Set((billingReportDetail || []).map((r) => r.status).filter(Boolean))
    );
    return ["All Status", ...unique];
  }, [billingReportDetail]);

  const filteredData = useMemo(() => {
    const term = searchTerm.toLowerCase();
    return (billingReportDetail || []).filter((item) => {
      const matchesSearch =
        !term ||
        item?.userName?.toLowerCase().includes(term) ||
        item?.email?.toLowerCase().includes(term);

      const matchesPlan =
        selectedPlan === "All Plans" ||
        item?.plan?.toLowerCase() === selectedPlan.toLowerCase();

      const matchesStatus =
        selectedStatus === "All Status" ||
        item?.status?.toLowerCase() === selectedStatus.toLowerCase();

      return matchesSearch && matchesPlan && matchesStatus;
    });
  }, [billingReportDetail, searchTerm, selectedPlan, selectedStatus]);

  const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-[#D0FAE5] text-[#428E43]";
      case "PAID":
        return "bg-[#D0FAE5] text-[#428E43]";
      case "PENDING":
        return "bg-[#FFF3CD] text-[#856404]";
      case "FAILED":
        return "bg-[#FFE2E2] text-[#FB0000]";
      case "OVERDUE":
        return "bg-[#FFE2E2] text-[#FB0000]";
      case "EXPIRED":
        return "bg-[#FFE2E2] text-[#FB0000]";
      case "CANCELLED":
        return "bg-[#F2F2F2] text-[#6C6D72]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="relative w-full bg-white dark:bg-slate-800 rounded-[16.54px] outfit p-6 shadow-sm min-h-[400px]">
      {billingLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-[16.54px]">
          <Loader fullPage={false} />
        </div>
      )}

      {/* Header Row */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="text-[20.75px] font-[500] text-[#000000] dark:text-white work-sans">
            Detailed Billing Report
          </h2>
          <p className="text-[15.41px] font-[400] text-[#434343] dark:text-gray-400">
            Recent platform incidents and their status
          </p>
        </div>

        {/* Filters Row */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Search */}
          <div className="bg-[#F2F2F2] dark:bg-slate-700 h-[40px] flex items-center gap-2 rounded-[11.56px] px-3 py-2 min-w-[220px]">
            <img src={searchIcon} alt="search" className="h-[16px] object-contain" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-transparent outline-none text-[#6C6D72] dark:text-white text-[13.73px]"
              placeholder="Search by name or email..."
            />
          </div>

          {/* Plan Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setPlanOpen(!planOpen); setStatusOpen(false); }}
              className="bg-[#F2F2F2] dark:bg-slate-700 px-3 py-2 h-[40px] flex rounded-[11.56px] w-[160px] justify-between items-center gap-2"
            >
              <span className="text-[#030213] dark:text-white text-[13.73px] truncate">{selectedPlan}</span>
              <img src={downarrow} alt="arrow" className={`h-1.5 object-contain dark:invert transition-transform flex-shrink-0 ${planOpen ? "rotate-180" : ""}`} />
            </button>
            {planOpen && (
              <div className="absolute top-[45px] left-0 w-full bg-white dark:bg-slate-700 shadow-lg rounded-[11.56px] z-50 border border-gray-100 dark:border-gray-600 overflow-hidden">
                {planOptions.map((opt) => (
                  <div
                    key={opt}
                    className="px-4 py-2 hover:bg-[#F2F2F2] dark:hover:bg-slate-600 cursor-pointer text-[13px] text-[#030213] dark:text-white"
                    onClick={() => { setSelectedPlan(opt); setPlanOpen(false); }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <button
              onClick={() => { setStatusOpen(!statusOpen); setPlanOpen(false); }}
              className="bg-[#F2F2F2] dark:bg-slate-700 px-3 py-2 h-[40px] flex rounded-[11.56px] w-[160px] justify-between items-center gap-2"
            >
              <span className="text-[#030213] dark:text-white text-[13.73px] truncate">{selectedStatus}</span>
              <img src={downarrow} alt="arrow" className={`h-1.5 object-contain dark:invert transition-transform flex-shrink-0 ${statusOpen ? "rotate-180" : ""}`} />
            </button>
            {statusOpen && (
              <div className="absolute top-[45px] left-0 w-full bg-white dark:bg-slate-700 shadow-lg rounded-[11.56px] z-50 border border-gray-100 dark:border-gray-600 overflow-hidden">
                {statusOptions.map((opt) => (
                  <div
                    key={opt}
                    className="px-4 py-2 hover:bg-[#F2F2F2] dark:hover:bg-slate-600 cursor-pointer text-[13px] text-[#030213] dark:text-white"
                    onClick={() => { setSelectedStatus(opt); setStatusOpen(false); }}
                  >
                    {opt}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-y-3 min-w-[1000px]">
          <thead>
            <tr className="text-left bg-[#FAF9FE] dark:bg-slate-700">
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">User Name</th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">Email</th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">Plan</th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500] text-center">Sub Status</th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">Total Billed</th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">Last Payment</th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500] text-center">Invoice Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr
                  key={index}
                  className="bg-[#FAFAFA] hover:bg-gray-100 transition-colors rounded-[9.02px] dark:bg-slate-900 shadow-sm"
                >
                  <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">{row.userName}</td>
                  <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">{row.email}</td>
                  <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">{row.plan}</td>
                  <td className="py-1 px-2 text-center">
                    <span className={`px-2 py-1 rounded-[75.17px] text-[13.53px] font-[400] uppercase ${getStatusStyles(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                    ${row.totalBilled?.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">{row.lastPayment}</td>
                  <td className="py-1 px-2 text-center">
                    <span className={`px-2 py-1 rounded-[75.17px] text-[13.53px] font-[400] uppercase ${getStatusStyles(row.invoiceStatus)}`}>
                      {row.invoiceStatus}
                    </span>
                  </td>
                </tr>
              ))
            ) : (
              !billingLoading && (
                <tr>
                  <td colSpan={7} className="text-center py-10 text-gray-500">
                    No billing data found.
                  </td>
                </tr>
              )
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDetailedBilling;
