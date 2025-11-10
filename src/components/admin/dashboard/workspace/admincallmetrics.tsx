
const AdminCallMetrics = () => {
  // Sample data for sales agents
  const salesAgents = [
    {
      name: 'Dianne Russell',
      avgcalltime: '2m 15s',
      objhandling: '67%',
      interest: '15%',
    },
    {
      name: 'Marvin McKinney',
      avgcalltime: '1m 14s',
      objhandling: '34%',
      interest: '10%',
    },
    {
      name: 'Kristin Watson',
      avgcalltime: '4m 20s',
      objhandling: '40%',
      interest: '20%',
    },
    {
      name: 'Dianne Russell',
      avgcalltime: '2m 15s',
      objhandling: '67%',
      interest: '15%',
    },
    {
      name: 'Marvin McKinney',
      avgcalltime: '1m 14s',
      objhandling: '34%',
      interest: '10%',
    },
    {
      name: 'Kristin Watson',
      avgcalltime: '4m 20s',
      objhandling: '40%',
      interest: '20%',
    },
    

  ];

  return (
    <div className='bg-white flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-4 rounded-4xl px-6 py-5 md:w-[50%]  w-full '>
      <h2 className="text-xl font-semibold text-gray-800 ">Agent Call Metrics</h2>
      
      {/* Scrollable Container */}
      <div className="overflow-y-auto custom-scrollbar">
        <table className="w-full text-left">
          <thead>
            {/* Table Header */}
            <tr className="text-[11px] text-gray-500">
              <th className="font-medium p-2  whitspace-nowrap ">Agent Name</th>
              <th className="font-medium p-2  whitspace-nowrap ">Avg. Tal Time</th>
              <th className="font-medium p-2  whitspace-nowrap ">Objection Handling %</th>
              <th className="font-medium p-2  whitspace-nowrap ">Interested %</th>
            </tr>
          </thead>
          <tbody>
            {/* Table Body - Mapping over agent data */}
            {salesAgents.map((agent, index) => (
              <tr key={index} className="border-t border-gray-200">
                <td className="p-3 text-[11px] font-medium  text-gray-900">{agent.name}</td>
                <td className="p-3 text-[11px]  text-gray-700">{agent.avgcalltime}</td>
                <td className="p-3 text-[11px]  text-gray-700">{agent.objhandling}</td>
                <td className="p-3 text-[11px]  text-gray-700">{agent.interest}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminCallMetrics;