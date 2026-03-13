import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getBillingReportDetail } from "@/store/slices/reportsSlice";
import type { RootState, AppDispatch } from "@/store/store";
import Loader from "@/components/common/Loader";

interface BillingProps {
  filters: {
    searchTerm: string;
    selectedPlan: string;
    selectedStatus: string;
  };
}

const SuperAdminDetailedBilling = ({ filters }: BillingProps) => {
  const dispatch = useDispatch<AppDispatch>();
  const { billingReportDetail, billingLoading } = useSelector(
    (state: RootState) => state.reports
  );

  useEffect(() => {
    dispatch(getBillingReportDetail());
  }, [dispatch]);

  // Status color helper
  const getStatusStyles = (status: string) => {
    switch (status.toUpperCase()) {
      case "ACTIVE":
        return "bg-[#D0FAE5] text-[#428E43]";
      case "PENDING":
        return "bg-[#FFDACA] text-[#FF0000]";
      case "OVERDUE":
        return "bg-[#FFE2E2] text-[#FB0000]";
      case "EXPIRED":
        return "bg-[#FFE2E2] text-[#FB0000]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredData = (billingReportDetail || []).filter((item) => {
    const searchTerm = filters.searchTerm.toLowerCase();
    const matchesSearch =
      item?.userName?.toLowerCase().includes(searchTerm) ||
      item?.email?.toLowerCase().includes(searchTerm);
    
    const matchesPlan =
      filters.selectedPlan === "All Plans" || 
      item?.plan?.toUpperCase() === filters.selectedPlan.toUpperCase();
    
    const matchesStatus =
      filters.selectedStatus === "All Status" || 
      item?.status?.toUpperCase() === filters.selectedStatus.toUpperCase();

    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="relative w-full bg-white dark:bg-slate-800 rounded-[16.54px] outfit p-6 shadow-sm min-h-[400px]">
      {billingLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-gray-800/50 rounded-[16.54px]">
          <Loader fullPage={false} />
        </div>
      )}

      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-[20.75px] font-[500] text-[#000000] dark:text-white work-sans">Detailed Billing Report</h2>
        <p className="text-[15.41px] font-[400] text-[#434343] dark:text-gray-400">Recent platform incidents and their status</p>
      </div>

      {/* Table Wrapper */}
      <div className="overflow-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-y-3 min-w-[1000px]">
          <thead>
            <tr className="text-left bg-[#FAF9FE] dark:bg-slate-700">
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">User Name</th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">Email</th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">Plan</th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500] text-center">Status</th>
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
                  <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                    {row.userName}
                  </td>
                  <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                    {row.email}
                  </td>
                  <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                    {row.plan}
                  </td>
                  <td className="py-1 px-2 text-center">
                    <span className={`px-2 py-1 rounded-[75.17px] text-[13.53px] font-[400] uppercase ${getStatusStyles(row.status)}`}>
                      {row.status}
                    </span>
                  </td>
                  <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                    ${row.totalBilled?.toLocaleString()}
                  </td>
                  <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                    {row.lastPayment}
                  </td>
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
