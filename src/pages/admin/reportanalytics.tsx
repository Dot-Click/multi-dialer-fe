import { useLocation } from "react-router-dom";
import AnalyticsDashboard from "@/components/agent/reportanalytics/analyticdashboard";
import ReportDashboard from "@/components/agent/reportanalytics/reportdashboard";
import { authClient } from "@/lib/auth-client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

import { useReports } from "@/hooks/useReports";

const ReportAnalytics = () => {
  const location = useLocation();

  const [_isLoadingUsers, setIsLoadingUsers] = useState(false)
  const [users, setUsers] = useState<any[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string>("");

  const { getAgentReport, report, loading } = useReports();

  const fetchUsers = async () => {
    setIsLoadingUsers(true);
    try {
      const { data, error } = await authClient.admin.listUsers({
        query: { limit: 20 }
      });
      if (error) {
        toast.error(error.message || "Failed to fetch users");
      } else if (data) {
        const agents = (data.users || []).filter((user: any) => user.role === "AGENT");
        setUsers(agents);
        if (agents.length > 0 && !selectedAgentId) {
          setSelectedAgentId(agents[0].id);
        }
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
    if (selectedAgentId) {
      getAgentReport({ userId: selectedAgentId });
    }
  }, [selectedAgentId, getAgentReport]);

  return (
    <div className=" min-h-screen  mr-10">
      <div className="flex flex-col gap-4">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-medium text-gray-900 mb-4">
            Reports & Analytics
          </h1>

          {/* Yaha route check ho raha hai */}
          {location.pathname === "/admin/reports-analytics" && (
            <select
              value={selectedAgentId}
              onChange={(e) => setSelectedAgentId(e.target.value)}
              className="bg-white w-56 text-sm font-medium border border-gray-200 px-2.5 py-2 rounded-md"
            >
              <option value="">Select Agent</option>
              {
                users
                  .map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name}
                    </option>
                  ))
              }
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
