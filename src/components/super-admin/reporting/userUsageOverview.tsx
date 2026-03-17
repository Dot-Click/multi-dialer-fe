import {  useEffect } from "react";
import searchIcon from "@/assets/searchIcon.png";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllSubscriptions } from "@/store/slices/subscriptionSlice";
import Loader from "@/components/common/Loader";

interface UserUsageOverviewProps {
  fromDate?: string;
  toDate?: string;
  selectedPlan?: string;
  selectedStatus?: string;
  searchTerm?: string;
  setSearchTerm?: (val: string) => void;
}

const UserUsageOverview = ({
  fromDate,
  toDate,
  selectedPlan,
  selectedStatus,
  searchTerm = "",
  setSearchTerm,
}: UserUsageOverviewProps) => {
  const dispatch = useAppDispatch();
  const { subscriptions, loading } = useAppSelector((state) => state.subscriptions);

  useEffect(() => {
    dispatch(getAllSubscriptions());
  }, [dispatch]);

  // Status color helper
  const getStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
        return "bg-[#1D2C45] text-[#fff]";
      case "EXPIRED":
      case "SUSPENDED":
        return "bg-[#D4183D] text-[#fff]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

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

    // Date filtering
    let matchesDate = true;
    if (fromDate && toDate && fromDate !== "Select Date" && toDate !== "Select Date") {
      const createdDate = new Date(item.createdAt);
      const start = new Date(fromDate);
      const end = new Date(toDate);
      end.setHours(23, 59, 59, 999); // Set to end of day
      matchesDate = createdDate >= start && createdDate <= end;
    }

    return matchesSearch && matchesPlan && matchesStatus && matchesDate;
  });

  const totalMRRR = filteredData.reduce((acc, curr) => acc + (Number(curr.amount) || 0), 0);

  if (loading && subscriptions.length === 0) {
    return (
      <div className="w-full bg-white dark:bg-slate-800 rounded-[16.54px] p-10 flex justify-center items-center h-[300px]">
        <Loader fullPage={false} />
      </div>
    );
  }

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-[16.54px] outfit p-6 shadow-sm">
      {/* Header Section */}
      <div className="mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-[20.75px] font-[500] text-[#000000] dark:text-white work-sans">
            User Usage Overview
          </h2>
          <p className="text-[15.41px] font-[400] outfit text-[#434343] dark:text-gray-400">
            Recent platform incidents and their status
          </p>
        </div>

        <div className="w-full md:w-[50%] bg-[#F2F2F2] dark:bg-slate-700 h-[40px] flex justify-start items-center gap-3 rounded-[11.56px] px-3 py-2">
          <span>
            <img
              src={searchIcon}
              alt="searchIcon"
              className="h-[17.34px] object-contain"
            />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm?.(e.target.value)}
            className="w-full text-[#6C6D72] outline-none dark:text-white dark:bg-transparent text-[13.73px] font-[400]"
            placeholder="Search by users or plans"
          />
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-y-3 min-w-[1000px]">
          <thead>
            <tr className="text-left bg-[#FAF9FE] dark:bg-slate-900">
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">
                User Name
              </th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">
                Current Plan
              </th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">
                Agent Count
              </th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">
                MRRR
              </th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500] text-center">
                Status
              </th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">
                Created Date
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredData.map((row) => (
              <tr
                key={row.id}
                className="bg-[#FAFAFA] dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors rounded-[9.02px]"
              >
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                  {row.user?.fullName || "N/A"}
                </td>
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                  {row.plan}
                </td>
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                  {row.usersCount}
                </td>
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                  ${row.amount || 0}
                </td>
                <td className="py-1 px-2 text-center">
                  <span
                    className={`px-3 py-1 rounded-[5px] outfit text-[13.53px] font-[500] ${getStatusStyles(row.status)}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                  {new Date(row.createdAt).toLocaleDateString()}
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && !loading && (
              <tr>
                <td colSpan={6} className="py-10 text-center text-gray-500">
                  No data found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div className="mt-4 flex justify-between text-[14px] text-[#86898C] dark:text-gray-500 font-[400]">
        <div>Showing {filteredData.length} of {subscriptions.length} records</div>
        <div className="font-medium text-[#1D2C45] dark:text-white">
          Total MRRR: ${totalMRRR.toLocaleString()}
        </div>
      </div>
    </div>
  );
};

export default UserUsageOverview;
