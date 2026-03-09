const AdminRecentActivity = () => {
  const recentActivity = [
    {
      id: 1,
      name: "Campaign is resumed for My Plus Leads 09/12/2025(FSBO)",
      date: "09/16/2025",
      time: "10:41:35 AM",
    },
    {
      id: 2,
      name: "Campaign is resumed for My Plus Leads 09/12/2025(FSBO)",
      date: "09/16/2025",
      time: "10:41:35 AM",
    },
    {
      id: 3,
      name: "Campaign is resumed for My Plus Leads 09/12/2025(FSBO)",
      date: "09/16/2025",
      time: "10:41:35 AM",
    },
    {
      id: 4,
      name: "Campaign is resumed for My Plus Leads 09/12/2025(FSBO)",
      date: "09/16/2025",
      time: "10:41:35 AM",
    },
    {
      id: 5,
      name: "Campaign is resumed for My Plus Leads 09/12/2025(FSBO)",
      date: "09/16/2025",
      time: "10:41:35 AM",
    },
    {
      id: 6,
      name: "Campaign is resumed for My Plus Leads 09/12/2025(FSBO)",
      date: "09/16/2025",
      time: "10:41:35 AM",
    },
    {
      id: 7,
      name: "Campaign is resumed for My Plus Leads 09/12/2025(FSBO)",
      date: "09/16/2025",
      time: "10:41:35 AM",
    },
  ];

  return (
    <section className="bg-white dark:bg-slate-800 flex flex-col h-[35vh] md:h-[28vh] lg:h-[45vh] gap-5 rounded-4xl px-6 py-5 md:w-[50%]  w-full ">
      <div className="flex flex-col justify-between gap-1.5">
        <h1 className="text-[20px] font-[500] dark:text-white">
          Recent Activity
        </h1>
      </div>

      <div className="flex flex-col gap-5  overflow-auto custom-scrollbar">
        {recentActivity.map((gr) => (
          <div
            key={gr.id}
            className="flex mx-2 rounded-md border-b gap-2 items-center border-gray-200 dark:border-slate-700"
          >
            <div className="flex flex-col gap-1.5 justify-between w-full">
              <h1 className=" text-[10px] md:text-[14px] font-[500] text-gray-950 dark:text-white">
                {gr.name}
              </h1>
              <div className="flex items-center gap-2">
                <h1 className="text-[9px] md:text-[12px] font-[400] text-[#495057] dark:text-gray-400">
                  {gr.date}
                </h1>
                <h1 className="text-[9px] md:text-[12px] font-[400] text-[#495057] dark:text-gray-400">
                  {gr.time}
                </h1>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default AdminRecentActivity;
