import AnalyticsDashboard from "@/components/agent/reportanalytics/analyticdashboard";
import ReportDashboard from "@/components/agent/reportanalytics/reportdashboard";

const ReportAnalytics = () => {
  return (
    <div className=" min-h-screen  mr-10">
      <div className="flex flex-col gap-4">
        {/* Page Header */}
        <h1 className="text-2xl font-medium text-gray-900 mb-4">
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