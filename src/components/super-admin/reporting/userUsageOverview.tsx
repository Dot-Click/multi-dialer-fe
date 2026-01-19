import searchIcon from "@/assets/searchIcon.png"

const billingData = [
    { 
        name: "Sarah Johnson", 
        plan: "Enterprise", 
        agentCount: 18, 
        mrrr: "$540", 
        status: "Suspended", 
        renewal: "Jan 10, 2025" 
    },
    { 
        name: "Sarah Johnson", 
        plan: "Professional", 
        agentCount: 24, 
        mrrr: "$960", 
        status: "Active", 
        renewal: "Dec 20, 2024" 
    },
    { 
        name: "Michael Chen", 
        plan: "Starter", 
        agentCount: 32, 
        mrrr: "$2,240", 
        status: "Active", 
        renewal: "Feb 5, 2025" 
    },
    { 
        name: "Emily Davis", 
        plan: "Enterprise", 
        agentCount: 67, 
        mrrr: "$2,680", 
        status: "Active", 
        renewal: "Jan 18, 2025" 
    },
    { 
        name: "Robert Wilson", 
        plan: "Professional", 
        agentCount: 78, 
        mrrr: "$3,120", 
        status: "Active", 
        renewal: "Feb 28, 2025" 
    },
    { 
        name: "Jessica Martinez", 
        plan: "Starter", 
        agentCount: 89, 
        mrrr: "$3,560", 
        status: "Active", 
        renewal: "Jan 28, 2025" 
    },
    { 
        name: "David Brown", 
        plan: "Enterprise", 
        agentCount: 123, 
        mrrr: "$5,600", 
        status: "Active", 
        renewal: "Feb 12, 2025" 
    },
    { 
        name: "Lisa Anderson", 
        plan: "Professional", 
        agentCount: 132, 
        mrrr: "$9,450", 
        status: "Active", 
        renewal: "Mar 10, 2025" 
    },
];

const UserUsageOverview = () => {

    // Status color helper (extended for Suspended)
    const getStatusStyles = (status: string) => {
        switch (status) {
            case 'Active':
                return 'bg-[#1D2C45] text-[#fff]';
            case 'Suspended':
                return 'bg-[#D4183D] text-[#fff]'; // red like overdue - matches most designs
            default:
                return 'bg-gray-100 text-gray-600';
        }
    };

    return (
        <div className="w-full bg-white rounded-[16.54px] outfit p-6 shadow-sm">
            {/* Header Section */}
            <div className="mb-6 flex justify-between items-center">
                <div>
                    <h2 className="text-[20.75px] font-[500] text-[#000000] work-sans">User Usage Overview</h2>
                    <p className="text-[15.41px] font-[400] outfit text-[#434343]">
                        Recent platform incidents and their status
                    </p>
                </div>

                <div className='w-full md:w-[50%] bg-[#F2F2F2] h-[40px] flex justify-start items-center gap-3 rounded-[11.56px] px-3 py-2'>
                    <span>
                        <img src={searchIcon} alt="searchIcon" className='h-[17.343202590942383] object-contain' />
                    </span>
                    <input 
                        type="text" 
                        className="w-full text-[#6C6D72] text-[13.73px] font-[400]" 
                        placeholder='Search by users' 
                    />
                </div>
            </div>

            {/* Table */}
            <div className="overflow-auto custom-scrollbar">
                <table className="w-full border-separate border-spacing-y-3 min-w-[1000px]">
                    <thead>
                        <tr className="text-left bg-[#FAF9FE]">
                            <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">User Name</th>
                            <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Current Plan</th>
                            <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Agent Count</th>
                            <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">MRRR</th>
                            <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500] text-center">Status</th>
                            <th className="py-4 px-4 text-[#1D2C45] text-[15.03px] font-[500]">Renewal Date</th>
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
                                    {row.plan}
                                </td>
                                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C]">
                                    {row.agentCount}
                                </td>
                                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C]">
                                    {row.mrrr}
                                </td>
                                <td className="py-1 px-2 text-center">
                                    <span className={`px-2 py-1 rounded-[5px] oufit text-[13.53px] font-[500] ${getStatusStyles(row.status)}`}>
                                        {row.status}
                                    </span>
                                </td>
                                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C]">
                                    {row.renewal}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer summary - optional but matches screenshot style */}
            <div className="mt-4 flex justify-between text-[14px] text-[#86898C] font-[400]">
                <div>Showing 12 of 12 companies</div>
                <div className="font-medium">Total MRRR: $49,900</div>
            </div>
        </div>
    );
};

export default UserUsageOverview;