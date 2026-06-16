import { useLocation } from "react-router-dom";
import AnalyticsDashboard from "@/components/agent/reportanalytics/analyticdashboard";
import ReportDashboard from "@/components/agent/reportanalytics/reportdashboard";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useReports } from "@/hooks/useReports";

const ReportAnalytics = () => {
  const location = useLocation();

  const [_isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [users, setUsers] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  const { getAgentReport, report, loading } = useReports();

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data: sessionData } = await authClient.getSession();
      const currentAdminId = sessionData?.user?.id;

      if (!currentAdminId) {
        toast.error("Unable to identify current admin");
        return;
      }

      const { data, error } = await authClient.admin.listUsers({
        query: { limit: 100 },
      });

      if (error) {
        toast.error(error.message || "Failed to fetch users");
      } else if (data) {
        const agents = (data.users || []).filter(
          (user: any) =>
            user.role === "AGENT" && user.createdById === currentAdminId,
        );
        setUsers(agents);
        // Do NOT auto-select an agent — default to the admin's own data.
        // The admin can explicitly pick an agent to view that agent's data.
      }
    } catch (err: any) {
      console.error("Fetch Users Error:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    // No agent selected → show the admin's own data (the backend defaults to
    // the requester when userId is omitted). Selecting an agent scopes to them.
    getAgentReport({ userId: selectedAgentId || undefined });
  }, [selectedAgentId, getAgentReport]);

  return (
    <div className="min-h-screen mr-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-gray-900 dark:text-white mb-4">
            Reports & Analytics
          </h1>

          {location.pathname === "/admin/reports-analytics" && (
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-white dark:bg-slate-800 dark:text-white w-56 text-sm font-medium border border-gray-200 dark:border-slate-700 px-2.5 py-2 rounded-md [&>option]:dark:bg-slate-800"
            >
              <option value="">My Data (Admin)</option>
              {users.map((user) => (
                <option key={user.id} value={user.id}>
                  {user.fullName || user.name || user.email}
                </option>
              ))}
            </select>
          )}
        </div>

        <AnalyticsDashboard data={report} loading={loading} />
        <ReportDashboard userId={selectedAgentId} />
      </div>
    </div>
  );
};

export default ReportAnalytics;
