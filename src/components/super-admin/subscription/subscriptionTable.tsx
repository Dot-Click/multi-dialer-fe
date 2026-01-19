import React, { useState } from "react";
import searchIcon from "@/assets/searchIcon.png";
import downarrow from "@/assets/downarrow.png";
import { FaRegEye } from "react-icons/fa";

const billingData = [
  {
    username: "Amanda Davis",
    plan: "Basic",
    invoiceId: "INV-2024-001",
    agents: 150,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    issueDate: "2024-12-01",
    dueDate: "2024-12-15",
  },
  {
    username: "Amanda Davis",
    plan: "Premium",
    invoiceId: "INV-2024-001",
    agents: 150,
    paymentStatus: "Pending",
    paymentMethod: "Credit Card",
    issueDate: "2024-12-01",
    dueDate: "2024-12-15",
  },
  {
    username: "Amanda Davis",
    plan: "Standard",
    invoiceId: "INV-2024-001",
    agents: 150,
    paymentStatus: "Overdue",
    paymentMethod: "Credit Card",
    issueDate: "2024-12-01",
    dueDate: "2024-12-15",
  },
  {
    username: "Amanda Davis",
    plan: "Standard",
    invoiceId: "INV-2024-001",
    agents: 150,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    issueDate: "2024-12-01",
    dueDate: "2024-12-15",
  },
  {
    username: "Amanda Davis",
    plan: "Basic",
    invoiceId: "INV-2024-001",
    agents: 150,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    issueDate: "2024-12-01",
    dueDate: "2024-12-15",
  },
  {
    username: "Amanda Davis",
    plan: "Premium",
    invoiceId: "INV-2024-001",
    agents: 150,
    paymentStatus: "Pending",
    paymentMethod: "Credit Card",
    issueDate: "2024-12-01",
    dueDate: "2024-12-15",
  },
  {
    username: "Amanda Davis",
    plan: "Premium",
    invoiceId: "INV-2024-001",
    agents: 150,
    paymentStatus: "Paid",
    paymentMethod: "Credit Card",
    issueDate: "2024-12-01",
    dueDate: "2024-12-15",
  },
];

const SubscriptionTable = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("All Plans");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  const getPaymentStatusStyles = (status) => {
    switch (status) {
      case "Paid":
        return "bg-[#D0FAE5] text-[#428E43]";
      case "Pending":
        return "bg-[#FFF3C4] text-[#9A7B00]";
      case "Overdue":
        return "bg-[#FFE2E2] text-[#FB0000]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  // Filter Logic
  const filteredData = billingData.filter((item) => {
    const matchesSearch =
      item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPlan =
      selectedPlan === "All Plans" || item.plan === selectedPlan;
    
    const matchesStatus =
      selectedStatus === "All Status" || item.paymentStatus === selectedStatus;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  return (
    <div className="w-full bg-white rounded-[16.54px] outfit p-5 flex flex-col gap-3 shadow-sm">
      
      {/* Header */}
      <div className="bg-[#FFFFFF] flex flex-col md:flex-row gap-5 md:gap-2 md:justify-between md:items-center w-full rounded-[13.48px]">
        <div className="w-full md:w-[65%] bg-[#F2F2F2] h-[40px] flex items-center gap-3 rounded-[11.56px] px-3 py-2">
          <img src={searchIcon} alt="searchIcon" className="h-[17.34px]" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full text-[#6C6D72] text-[13.73px] font-[400] bg-transparent outline-none"
            placeholder="Search by user name or invoice ID..."
          />
        </div>

        <div className="flex gap-6">
          {/* Plan Dropdown */}
          <div className="relative">
            <select 
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="appearance-none bg-[#F2F2F2] px-3 py-2 h-[40px] rounded-[11.56px] w-[150px] text-[#030213] text-[15.41px] font-[400] outline-none cursor-pointer"
            >
              <option value="All Plans">All Plans</option>
              <option value="Basic">Basic</option>
              <option value="Standard">Standard</option>
              <option value="Premium">Premium</option>
            </select>
            <img src={downarrow} alt="downarrow" className="h-1.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Status Dropdown */}
          <div className="relative">
            <select 
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-[#F2F2F2] px-3 py-2 h-[40px] rounded-[11.56px] w-[150px] text-[#030213] text-[15.41px] font-[400] outline-none cursor-pointer"
            >
              <option value="All Status">All Status</option>
              <option value="Paid">Paid</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
            <img src={downarrow} alt="downarrow" className="h-1.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-y-3 min-w-[1200px]">
          <thead>
            <tr className="bg-[#FAF9FE] text-left">
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Username</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Plan</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Invoice ID</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Agents</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500] text-center">Payment Status</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Payment Method</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Issue Date</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Due Date</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Action</th>
            </tr>
          </thead>

          <tbody>
            {filteredData.map((row, index) => (
              <tr
                key={index}
                className="bg-[#FAFAFA] hover:bg-gray-100 transition-colors rounded-[9.02px]"
              >
                <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.username}</td>
                <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.plan}</td>
                <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.invoiceId}</td>
                <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.agents}</td>
                <td className="py-1 px-2 text-center">
                  <span className={`px-2 py-1 rounded-[75.17px] text-[13.53px] ${getPaymentStatusStyles(row.paymentStatus)}`}>
                    {row.paymentStatus}
                  </span>
                </td>
                <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.paymentMethod}</td>
                <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.issueDate}</td>
                <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.dueDate}</td>
                <td className="py-4 px-4 text-[14px] text-[#2563EB] cursor-pointer ">
                    <div className="flex items-center gap-1.5">

                    <span><FaRegEye /></span>
                    <span>View Details</span>
                  
                    </div>
                </td>
              </tr>
            ))}
            {filteredData.length === 0 && (
              <tr>
                <td colSpan="9" className="text-center py-10 text-gray-500">
                  No data found matching your filters.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SubscriptionTable;