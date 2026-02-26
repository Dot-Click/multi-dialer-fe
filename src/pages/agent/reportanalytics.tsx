import AnalyticsDashboard from "@/components/agent/reportanalytics/analyticdashboard";
import ReportDashboard from "@/components/agent/reportanalytics/reportdashboard";
import { useReports } from "@/hooks/useReports";
import { useEffect } from "react";

const ReportAnalytics = () => {
  const { getAgentReport, report, loading } = useReports();

  useEffect(() => {
    getAgentReport();
  }, [getAgentReport]);

  return (
    <div className=" min-h-screen pb-7  mr-10">
      <div className="flex flex-col gap-4">
        {/* Page Header */}
        <h1 className="text-[28px] font-medium text-[#0E1011] ">
          Reports
        </h1>

        {/* Import and render the AnalyticsDashboard component */}
        <AnalyticsDashboard data={report} loading={loading} />
        <ReportDashboard />
      </div>
    </div>
  );
};

export default ReportAnalytics;