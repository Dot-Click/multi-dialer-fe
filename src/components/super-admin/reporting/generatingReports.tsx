import React from "react";
import { HiDownload } from "react-icons/hi";
import { LuFileText, LuEye } from "react-icons/lu";

const reportData = [
  {
    reportType: "Sarah Johnson",
    dateGenerated: "Enterprise",
    status: "Ready",
    fileSize: "2.4 MB",
  },
  {
    reportType: "Sarah Johnson",
    dateGenerated: "Professional",
    status: "Ready",
    fileSize: "1.8 MB",
  },
  {
    reportType: "Michael Chen",
    dateGenerated: "Starter",
    status: "Ready",
    fileSize: "3.1 MB",
  },
  {
    reportType: "Emily Davis",
    dateGenerated: "Enterprise",
    status: "Ready",
    fileSize: "4.2 MB",
  },
  {
    reportType: "Robert Wilson",
    dateGenerated: "Professional",
    status: "Ready",
    fileSize: "2.3 MB",
  },
  {
    reportType: "Jessica Martinez",
    dateGenerated: "Starter",
    status: "Ready",
    fileSize: "-",
  },
  {
    reportType: "David Brown",
    dateGenerated: "Enterprise",
    status: "Ready",
    fileSize: "1.9 MB",
  },
  {
    reportType: "Lisa Anderson",
    dateGenerated: "Professional",
    status: "Ready",
    fileSize: "4.0 MB",
  },
];

const GeneratingReports: React.FC = () => {
  // Status badge style helper
  const getStatusStyles = (status: string) => {
    switch (status) {
      case "Ready":
        return "bg-[#E6F9F1] text-[#28C76F]";
      case "Pending":
        return "bg-[#FFF4E5] text-[#FF9F43]";
      case "Error":
        return "bg-[#FFEBEE] text-[#EA5455]";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="w-full bg-white dark:bg-slate-800 rounded-[16.54px] outfit p-6 shadow-sm">
      {/* Header Section */}
      <div className="mb-6 flex justify-between items-center">
        <h2 className="text-[20.75px] font-[500] text-[#000000] dark:text-white work-sans">
          Generated Reports
        </h2>

        <button className="flex items-center gap-2 bg-[#030213] hover:bg-gray-800 text-white px-5 py-2.5 rounded-[10px] transition-all duration-200">
          <LuFileText className="text-[18px]" />
          <span className="text-[14px] font-[500] outfit">
            Generate New Report
          </span>
        </button>
      </div>

      {/* Table Section */}
      <div className="overflow-auto custom-scrollbar">
        <table className="w-full border-separate border-spacing-y-3 min-w-[1000px]">
          <thead>
            <tr className="text-left bg-[#FAF9FE] dark:bg-slate-900">
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">
                Report Type
              </th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">
                Date Generated
              </th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500] text-center">
                Status
              </th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500]">
                File Size
              </th>
              <th className="py-4 px-4 text-[#1D2C45] dark:text-white text-[15.03px] font-[500] text-center pl-8">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {reportData.map((row, index) => (
              <tr
                key={index}
                className="bg-[#FAFAFA] dark:bg-slate-700 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors rounded-[9.02px]"
              >
                {/* Each TD has rounded corners to give the row a "pill" appearance */}
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                  {row.reportType}
                </td>
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                  {row.dateGenerated}
                </td>
                <td className="py-1 px-2 text-center">
                  <span
                    className={`px-2 py-1 rounded-[5px] oufit text-[13.53px] font-[500] ${getStatusStyles(row.status)}`}
                  >
                    {row.status}
                  </span>
                </td>
                <td className="py-4 px-4 text-[13.53px] font-[400] text-[#2C2C2C] dark:text-white">
                  {row.fileSize}
                </td>
                <td className="py-4 px-6 text-right rounded-r-[12px]">
                  <div className="flex justify-end items-center gap-5">
                    <button className="flex items-center gap-1.5 text-[#52525B] dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-[500] text-[13px]">
                      <LuEye className="text-[16px]" />
                      <span>View</span>
                    </button>
                    <button className="flex items-center gap-1.5 text-[#52525B] dark:text-gray-400 hover:text-black dark:hover:text-white transition-colors font-[500] text-[13px]">
                      <HiDownload className="text-[16px]" />

                      <span>Download</span>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Footer summary */}
      <div className="mt-8 text-[14px] text-[#86898C] dark:text-gray-500 font-[400] outfit">
        Showing {reportData.length} reports
      </div>
    </div>
  );
};

export default GeneratingReports;
