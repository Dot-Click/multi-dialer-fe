import { useState } from "react";
import { BsThreeDotsVertical } from "react-icons/bs"; // ✅ import icon

const UserOverviewTable = () => {
    const [activeTab, setActiveTab] = useState(1); // default active tab

    const tabs = [
        { id: 1, name: "All" },
        { id: 2, name: "Active" },
        { id: 3, name: "Inactive" },
        { id: 4, name: "Expiring Soon" },
    ];

    // Sample user data
    const users = [
        { name: "Sarah Johnson", email: "sarah.johnson@example.com", plan: "Enterprise", status: "Active", renewal: "2025-03-15", created: "2024-06-12" },
        { name: "Michael Chen", email: "michael.chen@example.com", plan: "Professional", status: "Active", renewal: "2025-03-15", created: "2024-06-12" },
        { name: "Emily Davis", email: "emily.davis@example.com", plan: "Basic", status: "Expiring", renewal: "2025-03-15", created: "2024-06-12" },
        { name: "Emily Davis", email: "emily.davis@example.com", plan: "Basic", status: "Expiring", renewal: "2025-03-15", created: "2024-06-12" },
        { name: "Emily Davis", email: "emily.davis@example.com", plan: "Basic", status: "Expiring", renewal: "2025-03-15", created: "2024-06-12" },
        { name: "Emily Davis", email: "emily.davis@example.com", plan: "Basic", status: "Expiring", renewal: "2025-03-15", created: "2024-06-12" },
    ];

    const getStatusClass = (status: string ) => {
        if (status === "Active") return "bg-[#D0FAE5] text-[#428E43]";
        if (status === "Expiring") return "bg-[#FEF9C2] text-[#894B1F]";
        return "bg-red-400";
    };

    return (
        <section className="mt-3 bg-[#FFFFFF] h-[400px] flex flex-col gap-4 outfit shadow-sm pt-[23px] rounded-[32px] w-full  md:w-[70%]">
            {/* Heading + Buttons */}
            <div className="flex gap-2 justify-between items-center px-[24px] w-[80%]">
                <h1 className="text-[#315189] font-[600] text-[13px] md:text-[18.03px]">
                    Users Overview
                </h1>

                <div className="flex gap-2 flex-wrap items-center">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`rounded-[8.79px] py-[3px] px-[10px] text-[10px] md:text-[15.03px] font-[500] ${
                                activeTab === tab.id
                                    ? "bg-[#4E4E4E] text-white"
                                    : "bg-[#EAEAEA] text-[#717182]"
                            }`}
                        >
                            {tab.name}
                        </button>
                    ))}
                </div>
            </div>

            {/* Table */}
        <div className="overflow-auto custom-scrollbar outfit max-h-[300px]">
  <table className="min-w-full border-separate" style={{ borderSpacing: "0 8px" }}>
    <thead className="bg-[#FAF9FE] sticky top-0">
      <tr className="text-[#1D2C45]">
        <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">User Name</th>
        <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">Email</th>
        <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">Subscription Plan</th>
        <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">Status</th>
        <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">Renewal Date</th>
        <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]">Created On</th>
        <th className="text-left font-[500] whitespace-nowrap px-4 py-3 text-[15px]"></th>
      </tr>
    </thead>
    <tbody>
      {users.map((user, index) => (
        <tr
          key={index}
          className="bg-[#FAFAFA] rounded-lg hover:bg-gray-100 transition-all"
        >
          <td className="px-4 py-3 text-[#2C2C2C] text-[13.5px] font-[400] whitespace-nowrap">{user.name}</td>
          <td className="px-4 py-3 text-[#2C2C2C] text-[13.5px] font-[400] whitespace-nowrap">{user.email}</td>
          <td className="px-4 py-3 text-[#2C2C2C] text-[13.5px] font-[400] whitespace-nowrap">{user.plan}</td>
          <td className="px-4 py-3">
            <span className={`px-2 py-1.5 rounded-[75px] text-[10.5px] font-[400] ${getStatusClass(user.status)}`}>
              {user.status}
            </span>
          </td>
          <td className="px-4 py-3 text-[#2C2C2C] text-[13.5px] font-[400] whitespace-nowrap">{user.renewal}</td>
          <td className="px-4 py-3 text-[#2C2C2C] text-[13.5px] font-[400] whitespace-nowrap">{user.created}</td>
          <td className="px-4 py-3 text-[#6B7280] text-[16px] font-[500] whitespace-nowrap cursor-pointer">
            <BsThreeDotsVertical />
          </td>
        </tr>
      ))}
    </tbody>
  </table>
</div>

        </section>
    );
};

export default UserOverviewTable;
