import AnalyticsDashboard from "@/components/agent/reportanalytics/analyticdashboard";
import ReportDashboard from "@/components/agent/reportanalytics/reportdashboard";

const ReportAnalytics = () => {
  return (
    <div className=" min-h-screen pb-7  mr-10">
      <div className="flex flex-col gap-4">
        {/* Page Header */}
        <h1 className="text-[28px] font-[500] text-[#0E1011] ">
          Reports & Analytics
        </h1>

        {/* Import and render the AnalyticsDashboard component */}
        <AnalyticsDashboard />
        <ReportDashboard/>
      </div>
    </div>
  );
};

export default ReportAnalytics;