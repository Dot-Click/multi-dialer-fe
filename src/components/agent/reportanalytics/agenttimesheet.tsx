import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

// Sample data that mirrors the structure and content in the image
const timeSheetData = [
  {
    date: "18/06/2021",
    agent: "Bertha Wiza",
    device: "Web",
    logIn: "18/06/2021 09:13",
    logOut: "18/06/2021 09:13",
    timeLogged: "00:02:53",
  },
  {
    date: "29/10/2024",
    agent: "Bertha Wiza",
    device: "Web",
    logIn: "29/10/2024 15:36",
    logOut: "29/10/2024 15:36",
    timeLogged: "00:02:53",
  },
  {
    date: "2021/11/2013",
    agent: "Bertha Wiza",
    device: "Web",
    logIn: "2021/11/2013 20:01",
    logOut: "2021/11/2013 20:01",
    timeLogged: "00:02:53",
  },
  {
    date: "18/06/2021",
    agent: "Bertha Wiza",
    device: "Web",
    logIn: "18/06/2021 09:13",
    logOut: "18/06/2021 09:13",
    timeLogged: "00:02:53",
  },
  {
    date: "29/10/2024",
    agent: "Bertha Wiza",
    device: "Web",
    logIn: "29/10/2024 15:36",
    logOut: "29/10/2024 15:36",
    timeLogged: "00:02:53",
  },
  {
    date: "2021/11/2013",
    agent: "Bertha Wiza",
    device: "Web",
    logIn: "2021/11/2013 20:01",
    logOut: "2021/11/2013 20:01",
    timeLogged: "00:02:53",
  },
  {
    date: "18/06/2021",
    agent: "Bertha Wiza",
    device: "Web",
    logIn: "18/06/2021 09:13",
    logOut: "18/06/2021 09:13",
    timeLogged: "00:02:53",
  },
  {
    date: "29/10/2024",
    agent: "Bertha Wiza",
    device: "Web",
    logIn: "29/10/2024 15:36",
    logOut: "29/10/2024 15:36",
    timeLogged: "00:02:53",
  },
  {
    date: "2021/11/2013",
    agent: "Bertha Wiza",
    device: "Web",
    logIn: "2021/11/2013 20:01",
    logOut: "2021/11/2013 20:01",
    timeLogged: "00:02:53",
  },
  {
    date: "18/06/2021",
    agent: "Bertha Wiza",
    device: "Web",
    logIn: "18/06/2021 09:13",
    logOut: "18/06/2021 09:13",
    timeLogged: "00:02:53",
  },
];

const AgentTimeSheet = () => {
  return (
    // Page background color set here, if needed e.g., bg-gray-50
    <div className="pb-3 px-3 min-h-screen flex flex-col gap-3">
      {/* Date Filter */}
      <div className="flex items-center w-fit gap-[16px] border border-[#D8DCE1] dark:border-slate-700 rounded-[12px] px-[16px] h-[40px] cursor-pointer">
        <IoIosArrowBack className="text-[13px] text-[#71717A] dark:text-gray-400" />
        <span className="text-[16px] dark:text-gray-200">All Dates</span>
        <IoIosArrowForward className="text-[13px] text-[#71717A] dark:text-gray-400" />
      </div>

      {/* Table Container */}
      <div className="bg-white dark:bg-slate-800 overflow-hidden">
        {/* Mobile: horizontal scroll if table overflows */}
        <div className="overflow-x-auto md:overflow-x-visible">
          <table className="w-full text-sm text-left min-w-[600px] md:min-w-full">
            <thead className="bg-[#F7F7F7] dark:bg-slate-700 text-[#0E1011] dark:text-white">
              <tr>
                <th className="px-3 py-2 text-[14px] font-[500]">Date</th>
                <th className="px-3 py-2 text-[14px] font-[500]">Agent</th>
                <th className="px-3 py-2 text-[14px] font-[500]">Device</th>
                <th className="px-3 py-2 text-[14px] font-[500]">
                  Log In Time
                </th>
                <th className="px-3 py-2 text-[14px] font-[500]">
                  Log Out Time
                </th>
                <th className="px-3 py-2 text-[14px] font-[500]">
                  Time Logged
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-slate-700">
              {timeSheetData.map((row, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 dark:hover:bg-slate-700 text-gray-800 dark:text-gray-300"
                >
                  <td className="px-3 py-4 text-[14px] font-[400] whitespace-nowrap">
                    {row.date}
                  </td>
                  <td className="px-3 py-4 text-[14px] font-[500] whitespace-nowrap text-[#0E1011] dark:text-white">
                    {row.agent}
                  </td>
                  <td className="px-3 py-4 text-[14px] font-[400] whitespace-nowrap">
                    {row.device}
                  </td>
                  <td className="px-3 py-4 text-[14px] font-[400] whitespace-nowrap">
                    {row.logIn}
                  </td>
                  <td className="px-3 py-4 text-[14px] font-[400] whitespace-nowrap">
                    {row.logOut}
                  </td>
                  <td className="px-3 py-4 text-[14px] font-[400] whitespace-nowrap">
                    {row.timeLogged}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AgentTimeSheet;
