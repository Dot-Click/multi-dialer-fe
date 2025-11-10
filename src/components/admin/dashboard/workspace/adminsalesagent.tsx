
const AdminSalesAgent = () => {
  // Sample data for sales agents
  const salesAgents = [
    {
      name: 'Dianne Russell',
      totalCalls: 32,
      connectedCalls: 24,
      conversionRate: '15%',
    },
    {
      name: 'Marvin McKinney',
      totalCalls: 43,
      connectedCalls: 35,
      conversionRate: '10%',
    },
    {
      name: 'Kristin Watson',
      totalCalls: 54,
      connectedCalls: 46,
      conversionRate: '20%',
    },
    // Add more agents here to see the scrollbar effect
    {
      name: 'Robert Fox',
      totalCalls: 61,
      connectedCalls: 49,
      conversionRate: '22%',
    },
     {
      name: 'Jenny Wilson',
      totalCalls: 38,
      connectedCalls: 31,
      conversionRate: '18%',
    },
  ];

  return (
    <div className='bg-white flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-4 rounded-4xl px-6 py-5 md:w-[50%]  w-full '>
      <h2 className="text-xl font-semibold text-gray-800 ">Sales Agents</h2>
      
      {/* Scrollable Container */}
      <div className="overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            {/* Table Header */}
            <tr className="text-[11px] text-gray-500">
              <th className="font-medium p-2  whitspace-nowrap ">Agent Name</th>
              <th className="font-medium p-2  whitspace-nowrap ">Total Calls</th>
              <th className="font-medium p-2  whitspace-nowrap ">Connected Calls</th>
              <th className="font-medium p-2  whitspace-nowrap ">Conversion Rate</th>
            </tr>
          </thead>
          <tbody>
            {/* Table Body - Mapping over agent data */}
            {salesAgents.map((agent, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="p-3 text-[11px] font-medium  text-gray-900">{agent.name}</td>
                <td className="p-3 text-[11px]  text-gray-700">{agent.totalCalls}</td>
                <td className="p-3 text-[11px]  text-gray-700">{agent.connectedCalls}</td>
                <td className="p-3 text-[11px]  text-gray-700">{agent.conversionRate}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminSalesAgent;