// import { useState } from "react";
// import searchIcon from "@/assets/searchIcon.png";
// import downarrow from "@/assets/downarrow.png";
// import { FaRegEye } from "react-icons/fa";

// const billingData = [
//   {
//     username: "Amanda Davis",
//     plan: "Basic",
//     invoiceId: "INV-2024-001",
//     agents: 150,
//     paymentStatus: "Paid",
//     paymentMethod: "Credit Card",
//     issueDate: "2024-12-01",
//     dueDate: "2024-12-15",
//   },
//   {
//     username: "Amanda Davis",
//     plan: "Premium",
//     invoiceId: "INV-2024-001",
//     agents: 150,
//     paymentStatus: "Pending",
//     paymentMethod: "Credit Card",
//     issueDate: "2024-12-01",
//     dueDate: "2024-12-15",
//   },
//   {
//     username: "Amanda Davis",
//     plan: "Standard",
//     invoiceId: "INV-2024-001",
//     agents: 150,
//     paymentStatus: "Overdue",
//     paymentMethod: "Credit Card",
//     issueDate: "2024-12-01",
//     dueDate: "2024-12-15",
//   },
//   {
//     username: "Amanda Davis",
//     plan: "Standard",
//     invoiceId: "INV-2024-001",
//     agents: 150,
//     paymentStatus: "Paid",
//     paymentMethod: "Credit Card",
//     issueDate: "2024-12-01",
//     dueDate: "2024-12-15",
//   },
//   {
//     username: "Amanda Davis",
//     plan: "Basic",
//     invoiceId: "INV-2024-001",
//     agents: 150,
//     paymentStatus: "Paid",
//     paymentMethod: "Credit Card",
//     issueDate: "2024-12-01",
//     dueDate: "2024-12-15",
//   },
//   {
//     username: "Amanda Davis",
//     plan: "Premium",
//     invoiceId: "INV-2024-001",
//     agents: 150,
//     paymentStatus: "Pending",
//     paymentMethod: "Credit Card",
//     issueDate: "2024-12-01",
//     dueDate: "2024-12-15",
//   },
//   {
//     username: "Amanda Davis",
//     plan: "Premium",
//     invoiceId: "INV-2024-001",
//     agents: 150,
//     paymentStatus: "Paid",
//     paymentMethod: "Credit Card",
//     issueDate: "2024-12-01",
//     dueDate: "2024-12-15",
//   },
// ];

// const SubscriptionTable = () => {
//   const [searchTerm, setSearchTerm] = useState("");
//   const [selectedPlan, setSelectedPlan] = useState("All Plans");
//   const [selectedStatus, setSelectedStatus] = useState("All Status");

//   const getPaymentStatusStyles = (status) => {
//     switch (status) {
//       case "Paid":
//         return "bg-[#D0FAE5] text-[#428E43]";
//       case "Pending":
//         return "bg-[#FFF3C4] text-[#9A7B00]";
//       case "Overdue":
//         return "bg-[#FFE2E2] text-[#FB0000]";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   // Filter Logic
//   const filteredData = billingData.filter((item) => {
//     const matchesSearch =
//       item.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
//       item.invoiceId.toLowerCase().includes(searchTerm.toLowerCase());

//     const matchesPlan =
//       selectedPlan === "All Plans" || item.plan === selectedPlan;

//     const matchesStatus =
//       selectedStatus === "All Status" || item.paymentStatus === selectedStatus;

//     return matchesSearch && matchesPlan && matchesStatus;
//   });

//   return (
//     <div className="w-full bg-white rounded-[16.54px] outfit p-5 flex flex-col gap-3 shadow-sm">

//       {/* Header */}
//       <div className="bg-[#FFFFFF] flex flex-col md:flex-row gap-5 md:gap-2 md:justify-between md:items-center w-full rounded-[13.48px]">
//         <div className="w-full md:w-[65%] bg-[#F2F2F2] h-[40px] flex items-center gap-3 rounded-[11.56px] px-3 py-2">
//           <img src={searchIcon} alt="searchIcon" className="h-[17.34px]" />
//           <input
//             type="text"
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full text-[#6C6D72] text-[13.73px] font-[400] bg-transparent outline-none"
//             placeholder="Search by user name or invoice ID..."
//           />
//         </div>

//         <div className="flex gap-6">
//           {/* Plan Dropdown */}
//           <div className="relative">
//             <select
//               value={selectedPlan}
//               onChange={(e) => setSelectedPlan(e.target.value)}
//               className="appearance-none bg-[#F2F2F2] px-3 py-2 h-[40px] rounded-[11.56px] w-[150px] text-[#030213] text-[15.41px] font-[400] outline-none cursor-pointer"
//             >
//               <option value="All Plans">All Plans</option>
//               <option value="Basic">Basic</option>
//               <option value="Standard">Standard</option>
//               <option value="Premium">Premium</option>
//             </select>
//             <img src={downarrow} alt="downarrow" className="h-1.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
//           </div>

//           {/* Status Dropdown */}
//           <div className="relative">
//             <select
//               value={selectedStatus}
//               onChange={(e) => setSelectedStatus(e.target.value)}
//               className="appearance-none bg-[#F2F2F2] px-3 py-2 h-[40px] rounded-[11.56px] w-[150px] text-[#030213] text-[15.41px] font-[400] outline-none cursor-pointer"
//             >
//               <option value="All Status">All Status</option>
//               <option value="Paid">Paid</option>
//               <option value="Pending">Pending</option>
//               <option value="Overdue">Overdue</option>
//             </select>
//             <img src={downarrow} alt="downarrow" className="h-1.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
//           </div>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="overflow-auto custom-scrollbar">
//         <table className="w-full border-separate border-spacing-y-3 min-w-[1200px]">
//           <thead>
//             <tr className="bg-[#FAF9FE] text-left">
//               <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Username</th>
//               <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Plan</th>
//               <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Invoice ID</th>
//               <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Agents</th>
//               <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500] text-center">Payment Status</th>
//               <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Payment Method</th>
//               <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Issue Date</th>
//               <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Due Date</th>
//               <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Action</th>
//             </tr>
//           </thead>

//           <tbody>
//             {filteredData.map((row, index) => (
//               <tr
//                 key={index}
//                 className="bg-[#FAFAFA] hover:bg-gray-100 transition-colors rounded-[9.02px]"
//               >
//                 <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.username}</td>
//                 <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.plan}</td>
//                 <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.invoiceId}</td>
//                 <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.agents}</td>
//                 <td className="py-1 px-2 text-center">
//                   <span className={`px-2 py-1 rounded-[75.17px] text-[13.53px] ${getPaymentStatusStyles(row.paymentStatus)}`}>
//                     {row.paymentStatus}
//                   </span>
//                 </td>
//                 <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.paymentMethod}</td>
//                 <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.issueDate}</td>
//                 <td className="py-4 px-4 text-[14px] text-[#2C2C2C]">{row.dueDate}</td>
//                 <td className="py-4 px-4 text-[14px] text-[#2563EB] cursor-pointer ">
//                     <div className="flex items-center gap-1.5">

//                     <span><FaRegEye /></span>
//                     <span>View Details</span>

//                     </div>
//                 </td>
//               </tr>
//             ))}
//             {filteredData.length === 0 && (
//               <tr>
//                 <td colSpan="9" className="text-center py-10 text-gray-500">
//                   No data found matching your filters.
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default SubscriptionTable;

import { useState, useEffect } from "react";
import searchIcon from "@/assets/searchIcon.png";
import downarrow from "@/assets/downarrow.png";
import { FaRegEye } from "react-icons/fa";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { allSubs } from "@/store/slices/subscriptionSlice";

const SubscriptionTable = () => {
  const dispatch = useAppDispatch();
  const { subscriptions, loading, error } = useAppSelector((state) => state.subscriptions);

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPlan, setSelectedPlan] = useState("All Plans");
  const [selectedStatus, setSelectedStatus] = useState("All Status");

  useEffect(() => {
    dispatch(allSubs());
  }, [dispatch]);

  const getPaymentStatusStyles = (status: string) => {
    switch (status?.toUpperCase()) {
      case "ACTIVE":
      case "PAID":
        return "bg-[#D0FAE5] text-[#428E43]";
      case "PENDING":
        return "bg-[#FFF3C4] text-[#9A7B00]";
      case "EXPIRED":
      case "OVERDUE":
        return "bg-[#FFE2E2] text-[#FB0000]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  const filteredData = subscriptions?.filter((item) => {
    const matchesSearch =
      item.userId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.id?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPlan =
      selectedPlan === "All Plans" || item.plan?.toUpperCase() === selectedPlan?.toUpperCase();

    const matchesStatus =
      selectedStatus === "All Status" || item.status?.toUpperCase() === selectedStatus?.toUpperCase();

    return matchesSearch && matchesPlan && matchesStatus;
  }) || [];

  return (
    // <div className="w-full bg-white rounded-[16.54px] outfit p-5 flex flex-col gap-3 shadow-sm">
    //   <div className="bg-[#FFFFFF] flex flex-col md:flex-row gap-5 md:gap-2 md:justify-between md:items-center w-full rounded-[13.48px]">
    //     <div className="w-full md:w-[65%] bg-[#F2F2F2] h-[40px] flex items-center gap-3 rounded-[11.56px] px-3 py-2">
    //       <img src={searchIcon} alt="searchIcon" className="h-[17.34px]" />
    //       <input
    //         type="text"
    //         value={searchTerm}
    //         onChange={(e) => setSearchTerm(e.target.value)}
    //         className="w-full text-[#6C6D72] text-[13.73px] font-[400] bg-transparent outline-none"
    //         placeholder="Search by user name or invoice ID..."
    //       />
    //     </div>

    //     <div className="flex gap-6">
    //       <div className="relative">
    //         <select
    //           value={selectedPlan}
    //           onChange={(e) => setSelectedPlan(e.target.value)}
    //           className="appearance-none bg-[#F2F2F2] px-3 py-2 h-[40px] rounded-[11.56px] w-[150px] text-[#030213] text-[15.41px] font-[400] outline-none cursor-pointer"
    //         >
    //           <option value="All Plans">All Plans</option>
    //           <option value="Basic">Basic</option>
    //           <option value="Standard">Standard</option>
    //           <option value="Premium">Premium</option>
    //         </select>
    //         <img
    //           src={downarrow}
    //           alt="downarrow"
    //           className="h-1.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
    //         />
    //       </div>

    //       <div className="relative">
    //         <select
    //           value={selectedStatus}
    //           onChange={(e) => setSelectedStatus(e.target.value)}
    //           className="appearance-none bg-[#F2F2F2] px-3 py-2 h-[40px] rounded-[11.56px] w-[150px] text-[#030213] text-[15.41px] font-[400] outline-none cursor-pointer"
    //         >
    //           <option value="All Status">All Status</option>
    //           <option value="Paid">Paid</option>
    //           <option value="Pending">Pending</option>
    //           <option value="Overdue">Overdue</option>
    //         </select>
    //         <img
    //           src={downarrow}
    //           alt="downarrow"
    //           className="h-1.5 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
    //         />
    //       </div>
    //     </div>
    //   </div>

    //   <div className="overflow-auto custom-scrollbar">
    //     <table className="w-full border-separate border-spacing-y-3 min-w-[1200px]">
    //       <tbody>
    //         {filteredData.map((row, index) => (
    //           <tr key={index} className="bg-[#FAFAFA]">
    //             <td>{row.username}</td>
    //             <td>{row.plan}</td>
    //             <td>{row.invoiceId}</td>
    //             <td>{row.agents}</td>
    //             <td className="text-center">
    //               <span
    //                 className={`px-2 py-1 rounded-[75.17px] ${getPaymentStatusStyles(
    //                   row.paymentStatus
    //                 )}`}
    //               >
    //                 {row.paymentStatus}
    //               </span>
    //             </td>
    //             <td>{row.paymentMethod}</td>
    //             <td>{row.issueDate}</td>
    //             <td>{row.dueDate}</td>
    //             <td className="text-[#2563EB] cursor-pointer">
    //               <div className="flex items-center gap-1.5">
    //                 <FaRegEye /> View Details
    //               </div>
    //             </td>
    //           </tr>
    //         ))}

    //         {filteredData.length === 0 && (
    //           <tr>
    //             <td colSpan={9} className="text-center py-10 text-gray-500">
    //               No data found matching your filters.
    //             </td>
    //           </tr>
    //         )}
    //       </tbody>
    //     </table>
    //   </div>
    // </div>
    <div className="bg-white dark:bg-slate-800 rounded-2xl p-5 mt-5">
      <h1 className="text-[20px] font-medium text-[#111] dark:text-white mb-4">
        Subscription List
      </h1>

      {/* ===== FILTERS ===== */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <div className="flex items-center gap-3 bg-[#F2F2F2] dark:bg-slate-700 rounded-[11.56px] px-3 h-[40px] w-full md:w-[60%]">
          <img src={searchIcon} className="h-[16px]" />
          <input
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by user name or invoice ID..."
            className="bg-transparent w-full outline-none text-[13.53px] text-[#2C2C2C] dark:text-white"
          />
        </div>

        <div className="flex gap-4">
          <div className="relative">
            <select
              value={selectedPlan}
              onChange={(e) => setSelectedPlan(e.target.value)}
              className="appearance-none bg-[#F2F2F2] dark:bg-slate-700 h-[40px] px-4 rounded-[11.56px] text-[13.53px] text-[#2C2C2C] dark:text-white w-[150px]"
            >
              <option value="All Plans">All Plans</option>
              {/* <option value="BASIC">Basic</option> */}
              <option value="STARTER">Starter</option>
              <option value="PROFESSIONAL">Professional</option>
              {/* <option value="PREMIUM">Premium</option> */}
              <option value="ENTERPRISE">Enterprise</option>
            </select>
            <img
              src={downarrow}
              className="h-1.5 absolute right-4 dark:invert top-1/2 -translate-y-1/2"
            />
          </div>

          <div className="relative">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="appearance-none bg-[#F2F2F2] dark:bg-slate-700 h-[40px] px-4 rounded-[11.56px] text-[13.53px] text-[#2C2C2C] dark:text-white w-[150px]"
            >
              <option value="All Status">All Status</option>
              <option value="ACTIVE">Active</option>
              <option value="EXPIRED">Expired</option>
              <option value="PAID">Paid</option>
              <option value="PENDING">Pending</option>
              <option value="OVERDUE">Overdue</option>
            </select>
            <img
              src={downarrow}
              className="h-1.5 absolute right-4 dark:invert top-1/2 -translate-y-1/2"
            />
          </div>
        </div>
      </div>

      {/* ===== TABLE ===== */}
      <div className="overflow-x-auto">
        <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
          <table className="w-full min-w-[1200px] border-separate border-spacing-y-3">
            <thead>
              <tr>
                {[
                  "Username",
                  "Plan",
                  "Invoice ID",
                  "Agents",
                  "Payment Status",
                  "Payment Method",
                  "Issue Date",
                  "Due Date",
                  "Action",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-5 py-3 text-left text-[15.03px] bg-[#FAF9FE] dark:bg-slate-900 font-[500] text-[#1D2C45] dark:text-white sticky top-0 z-10"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-red-500">
                    {error}
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={9} className="text-center py-10 text-gray-500">
                    No data found
                  </td>
                </tr>
              ) : (
                filteredData.map((row, i) => (
                  <tr
                    key={i}
                    className="bg-[#FAFAFA] dark:bg-slate-700 font-[400] rounded-[9.02px]"
                  >
                    <td className="px-5 py-4 rounded-l-[9.02px] text-[13.53px] font-medium text-[#2C2C2C] dark:text-white">
                      {row.user?.fullName}
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {row.plan || "-"}
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {row.id}
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {row.usersCount || "-"}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`px-3 py-1 text-[13.53px] rounded-[75.17px] ${getPaymentStatusStyles(
                          row.status as string,
                        )}`}
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {row.billingCycle || "-"}
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {row.startDate ? new Date(row.startDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-5 py-4 text-[13.53px] text-[#2C2C2C] dark:text-white">
                      {row.endDate ? new Date(row.endDate).toLocaleDateString() : "-"}
                    </td>
                    <td className="px-5 py-4 text-[#2563EB]">
                      <div className="flex items-center gap-2 cursor-pointer">
                        <FaRegEye /> View Details
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionTable;
