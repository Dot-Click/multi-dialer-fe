import { HiMail, HiOutlineChatAlt2 } from "react-icons/hi";
import { FiPlus } from "react-icons/fi";

const TouchPoints = () => {
  // Campaign Data matching the image
  const campaigns = [
    {
      id: 1,
      title: "Weekly Newsletter",
      frequency: "Weekly",
      status: "active",
    },
    {
      id: 2,
      title: "Monthly Market Report",
      frequency: "Monthly",
      status: "active",
    },
    {
      id: 3,
      title: "Welcome Series",
      frequency: "One-time",
      status: "inactive",
    },
  ];

  return (
    <div className="w-full bg-white dark:bg-slate-800 p-4 md:p-8 font-inter text-[#0E1011] dark:text-white transition-colors">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-[18px] font-bold dark:text-white">SMS Messaging</h1>
        <p className="text-[#848C94] text-[13px] mt-1">
          Manage automated Email and Direct Mail campaigns
        </p>
      </div>

      {/* Tabs / Toggle Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        {/* Email Campaigns Tab (Active) */}
        <button className="flex-1 bg-[#111111] text-white py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all hover:opacity-90">
          <HiMail className="text-xl" />
          <span className="text-[15px] font-medium">Email Campaigns</span>
        </button>

        {/* Direct Mail Campaigns Tab (Inactive) */}
        <button className="flex-1 bg-white dark:bg-gray-700 border border-[#E5E7EB] dark:border-gray-600 text-[#111111] dark:text-white py-3.5 px-6 rounded-xl flex items-center justify-center gap-3 transition-all hover:bg-gray-50 dark:hover:bg-gray-600">
          <HiOutlineChatAlt2 className="text-xl text-gray-700 dark:text-gray-300" />
          <span className="text-[15px] font-medium">Direct Mail Campaigns</span>
        </button>
      </div>

      {/* Add Touch Point Action */}
      <div className="mb-10">
        <button className="w-full border border-[#E5E7EB] dark:border-gray-700 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all">
          <FiPlus className="text-gray-600 dark:text-gray-300 text-lg" />
          <span className="text-[15px] font-medium text-[#111111] dark:text-white">Add Touch Point</span>
        </button>
      </div>

      {/* Campaign List Section */}
      <div className="space-y-4">
        {campaigns.map((camp) => (
          <div
            key={camp.id}
            className="w-full bg-[#F4F5F8] dark:bg-gray-700 p-6 rounded-xl flex items-center justify-between group cursor-default transition-all hover:bg-[#EEF0F4] dark:hover:bg-gray-600"
          >
            <div className="flex flex-col gap-1">
              <h3 className="text-[16px] font-semibold text-[#111111] dark:text-white">
                {camp.title}
              </h3>
              <p className="text-[13px] text-[#848C94] font-normal">
                {camp.frequency}
              </p>
            </div>

            {/* Status Badge */}
            <div
              className={`px-4 py-1.5 rounded-lg text-[12px] font-medium tracking-wide ${
                camp.status === 'active'
                  ? 'bg-[#111111] text-white'
                  : 'bg-[#C4C4C4] text-white'
              }`}
            >
              {camp.status}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TouchPoints;