import { useLocation } from "react-router-dom";
import AnalyticsDashboard from "@/components/agent/reportanalytics/analyticdashboard";
import ReportDashboard from "@/components/agent/reportanalytics/reportdashboard";

const ReportAnalytics = () => {
  const location = useLocation(); // current route lene ke liye

  return (
    <div className=" min-h-screen  mr-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">
            Reports & Analytics
          </h1>

          {/* Yaha route check ho raha hai */}
          {location.pathname === "/admin/reports-analytics" && (
            <select className="bg-white w-56 text-sm font-[500] border border-gray-200 px-2.5 py-2 rounded-md">
              <option value="BerthaWiza">Bertha Wiza</option>
            </select>
          )}
        </div>

        <AnalyticsDashboard />
        <ReportDashboard />
      </div>
    </div>
  );
};

export default ReportAnalytics;
