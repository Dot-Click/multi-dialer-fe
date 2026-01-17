
const billingData = [
  { name: "Sarah Johnson", email: "john.smith@example.com", plan: "Enterprise", status: "Active", billed: "$4,500", lastPayment: "2024-12-15", invoiceStatus: "Active" },
  { name: "Sarah Johnson", email: "sarah.j@example.com", plan: "Professional", status: "Active", billed: "$2,800", lastPayment: "2024-12-20", invoiceStatus: "Active" },
  { name: "Michael Chen", email: "m.chen@example.com", plan: "Starter", status: "Pending", billed: "$1,200", lastPayment: "2024-11-30", invoiceStatus: "Pending" },
  { name: "Emily Davis", email: "emily.davis@example.com", plan: "Enterprise", status: "Active", billed: "$6,200", lastPayment: "2024-12-18", invoiceStatus: "Active" },
  { name: "Robert Wilson", email: "r.wilson@example.com", plan: "Professional", status: "Overdue", billed: "$3,400", lastPayment: "2024-10-28", invoiceStatus: "Overdue" },
  { name: "Jessica Martinez", email: "j.martinez@example.com", plan: "Starter", status: "Active", billed: "$980", lastPayment: "2024-12-22", invoiceStatus: "Active" },
  { name: "David Brown", email: "david.b@example.com", plan: "Enterprise", status: "Pending", billed: "$5,100", lastPayment: "2024-11-25", invoiceStatus: "Pending" },
  { name: "Lisa Anderson", email: "l.anderson@example.com", plan: "Professional", status: "Active", billed: "$3,200", lastPayment: "2024-12-19", invoiceStatus: "Active" },
];

const SuperAdminDetailedBilling = () => {
  
  // Status color helper
  const getStatusStyles = (status :string) => {
    switch (status) {
      case 'Active':
        return 'bg-[#D0FAE5] text-[#428E43]';
      case 'Pending':
        return 'bg-[#FFDACA] text-[#FF0000]';
      case 'Overdue':
        return 'bg-[#FFE2E2] text-[#FB0000]';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <div className="w-full bg-white rounded-[16.54px] outfit p-6 shadow-sm   ">
      {/* Header Section */}
      <div className="mb-6">
        <h2 className="text-[20.75px] font-[500] text-[#000000] work-sans">Detailed Billing Report</h2>
        <p className="text-[15.41px] font-[400] text-[#434343]">Recent platform incidents and their status</p>
      </div>

      {/* Table Wrapper with requested classes */}
      <div className="overflow-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-y-3 min-w-[1000px]">
          <thead>
            <tr className="text-left bg-[#FAF9FE] ">
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">User Name</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Email</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Plan</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500] text-center">Status</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Total Billed</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Last Payment</th>
              <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500] text-center">Invoice Status</th>
            </tr>
          </thead>
          <tbody>
            {billingData.map((row, index) => (
              <tr 
                key={index} 
                className="bg-[#FAFAFA] hover:bg-gray-100 transition-colors rounded-[9.02px]"
              >
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C]">
                  {row.name}
                </td>
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C]">
                  {row.email}
                </td>
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C]">
                  {row.plan}
                </td>
                <td className="py-1 px-2 text-center">
                  <span className={`px-2 py-1 rounded-[75.17px] text-[13.53px] font-[400] ${getStatusStyles(row.status)}`}>
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C]">
                  {row.billed}
                </td>
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C]">
                  {row.lastPayment}
                </td>
                <td className="py-1 px-2 text-center">
                  <span className={`px-2 py-1 rounded-[75.17px] text-[13.53px] font-[400] ${getStatusStyles(row.status)}`}>
                    {row.invoiceStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SuperAdminDetailedBilling;