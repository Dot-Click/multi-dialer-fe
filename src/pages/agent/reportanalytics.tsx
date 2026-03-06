import AnalyticsDashboard from "@/components/agent/reportanalytics/analyticdashboard";
import ReportDashboard from "@/components/agent/reportanalytics/reportdashboard";
import { useReports } from "@/hooks/useReports";
import { useEffect, useState } from "react";
import { authClient } from "@/lib/auth-client";
import toast from "react-hot-toast";

const ReportAnalytics = () => {
  const { getAgentReport, report, loading } = useReports();
  const [userId, setUserId] = useState<string>("");

  useEffect(() => {
    const fetchSession = async () => {
      try {
        const { data: sessionData } = await authClient.getSession();
        const currentUserId = sessionData?.user?.id;

        if (!currentUserId) {
          toast.error("Unable to identify current user");
          return;
        }

        setUserId(currentUserId);
      } catch (err) {
        console.error("Fetch Session Error:", err);
      }
    };

    fetchSession();
  }, []);

  useEffect(() => {
    if (userId) {
      getAgentReport({ userId });
    }
  }, [userId, getAgentReport]);

  return (
    <div className=" min-h-screen pb-7  mr-10">
      <div className="flex flex-col gap-4">
        {/* Page Header */}
        <h1 className="text-[28px] font-medium text-[#0E1011] ">
          Reports
        </h1>

        {/* Import and render the AnalyticsDashboard component */}
        <AnalyticsDashboard data={report} loading={loading} />
        {userId && <ReportDashboard userId={userId} />}
      </div>
    </div>
  );
};

export default ReportAnalytics;