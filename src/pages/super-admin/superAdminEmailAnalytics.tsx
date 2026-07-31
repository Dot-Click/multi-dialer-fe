import React, { useState } from "react";
import { MoveLeft, Loader2, Info, Mail, MailCheck, MailOpen, MousePointerClick, AlertTriangle, ShieldAlert } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  useEmailAnalyticsSummary,
  useEmailTimeline,
  useEmailLogs,
  useDeadLetterQueue,
  type EmailLogRow,
} from "@/hooks/useEmailAnalytics";

const StatCard: React.FC<{ label: string; value: string | number; icon: React.ReactNode; tone?: "default" | "warning" | "danger" }> = ({
  label,
  value,
  icon,
  tone = "default",
}) => (
  <div className="bg-white dark:bg-slate-800 rounded-[16px] shadow-sm border border-gray-100 dark:border-slate-700 p-4 flex items-center gap-3">
    <div
      className={`p-2.5 rounded-xl shrink-0 ${
        tone === "danger"
          ? "bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400"
          : tone === "warning"
            ? "bg-amber-50 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400"
            : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
      }`}
    >
      {icon}
    </div>
    <div>
      <p className="text-[12px] text-[#828291] dark:text-gray-400">{label}</p>
      <p className="text-[20px] font-semibold text-[#2C2C2C] dark:text-white">{value}</p>
    </div>
  </div>
);

const bounceBadge = (bounceType?: "SOFT" | "HARD" | null) => {
  if (!bounceType) return null;
  return (
    <span
      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
        bounceType === "HARD"
          ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
          : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
      }`}
    >
      {bounceType} bounce
    </span>
  );
};

const statusBadge = (status: "SENT" | "FAILED") => (
  <span
    className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full ${
      status === "SENT"
        ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
        : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
    }`}
  >
    {status}
  </span>
);

const SuperAdminEmailAnalytics: React.FC = () => {
  const navigate = useNavigate();
  const [page, setPage] = useState(1);
  const [tab, setTab] = useState<"logs" | "dead">("logs");
  const limit = 20;

  const { data: summary, isLoading: summaryLoading } = useEmailAnalyticsSummary();
  const { data: timeline } = useEmailTimeline(30);
  const { data: logsData, isLoading: logsLoading } = useEmailLogs({ page, limit });
  const { data: deadData, isLoading: deadLoading } = useDeadLetterQueue({ page, limit });

  const maxTimelineSent = Math.max(1, ...(timeline?.map((t) => t.sent + t.failed) || [1]));

  return (
    <section className="w-full min-h-screen flex flex-col gap-6 px-6 py-6 outfit bg-[#F5F6FA] dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-gray-200 dark:hover:bg-slate-700 rounded-full transition-colors flex items-center justify-center"
          >
            <MoveLeft className="w-6 h-6 text-[#343434] dark:text-white" />
          </button>
          <div>
            <h1 className="text-[#2C2C2C] dark:text-white text-[24px] md:text-[32px] font-semibold inter">
              Email Analytics
            </h1>
            <p className="text-[#828291] dark:text-gray-400 text-[14px] md:text-[16px]">
              Delivery, engagement, and bounce tracking across all outbound email
            </p>
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {summaryLoading ? (
        <div className="flex justify-center py-10">
          <Loader2 className="w-6 h-6 animate-spin text-[#030213] dark:text-white" />
        </div>
      ) : summary ? (
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
          <StatCard label="Sent" value={summary.totalSent} icon={<Mail size={18} />} />
          <StatCard label="Delivery Rate" value={`${summary.deliveryRate}%`} icon={<MailCheck size={18} />} />
          <StatCard label="Open Rate" value={`${summary.engagement.openRate}%`} icon={<MailOpen size={18} />} />
          <StatCard label="Click Rate" value={`${summary.engagement.clickRate}%`} icon={<MousePointerClick size={18} />} />
          <StatCard
            label="Bounce Rate"
            value={`${summary.engagement.bounceRate}%`}
            icon={<AlertTriangle size={18} />}
            tone={summary.engagement.bounceRate > 2 ? "danger" : "default"}
          />
          <StatCard
            label="Complaint Rate"
            value={`${summary.suppressions.complaintRate}%`}
            icon={<ShieldAlert size={18} />}
            tone={summary.suppressions.complaintRate > 0.1 ? "danger" : "default"}
          />
          <StatCard
            label="Dead-letter Queue"
            value={summary.queue.dead}
            icon={<AlertTriangle size={18} />}
            tone={summary.queue.dead > 0 ? "warning" : "default"}
          />
        </div>
      ) : null}

      {/* 30-day timeline */}
      <div className="bg-white dark:bg-slate-800 rounded-[16px] shadow-sm border border-gray-100 dark:border-slate-700 p-4">
        <p className="text-[13px] font-semibold text-[#495057] dark:text-gray-300 mb-3">Last 30 days</p>
        {timeline && timeline.length > 0 ? (
          <div className="flex items-end gap-1 h-32">
            {timeline.map((point) => {
              const total = point.sent + point.failed;
              const heightPct = Math.max(2, (total / maxTimelineSent) * 100);
              const failedPct = total > 0 ? (point.failed / total) * 100 : 0;
              return (
                <div key={point.date} className="flex-1 h-full flex flex-col justify-end group relative">
                  <div
                    className="w-full rounded-t-sm bg-blue-400 dark:bg-blue-500 relative overflow-hidden"
                    style={{ height: `${heightPct}%` }}
                  >
                    {failedPct > 0 && (
                      <div className="absolute bottom-0 left-0 right-0 bg-red-400 dark:bg-red-500" style={{ height: `${failedPct}%` }} />
                    )}
                  </div>
                  <div className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 hidden group-hover:flex flex-col items-center bg-gray-900 text-white text-[10px] rounded px-2 py-1 whitespace-nowrap z-10">
                    <span>{format(new Date(point.date), "MMM d")}</span>
                    <span>{point.sent} sent · {point.failed} failed · {point.opened} opened</span>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <p className="text-[13px] text-gray-400 py-8 text-center">No email activity in the last 30 days.</p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <button
          onClick={() => { setTab("logs"); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
            tab === "logs" ? "bg-[#FFCA06] text-gray-900" : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700"
          }`}
        >
          Activity History
        </button>
        <button
          onClick={() => { setTab("dead"); setPage(1); }}
          className={`px-4 py-2 rounded-xl text-[13px] font-semibold transition-colors ${
            tab === "dead" ? "bg-[#FFCA06] text-gray-900" : "bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-slate-700"
          }`}
        >
          Dead-letter Queue{summary?.queue.dead ? ` (${summary.queue.dead})` : ""}
        </button>
      </div>

      {/* Activity History table */}
      {tab === "logs" && (
        <div className="bg-white dark:bg-slate-800 rounded-[22px] shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] dark:bg-slate-700/50">
                  {["Recipient", "Subject", "Status", "Delivered", "Opens", "Clicks", "Sent At"].map((h) => (
                    <th key={h} className="px-6 py-4 text-[13px] font-semibold text-[#495057] dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {logsLoading ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#030213] dark:text-white" />
                    </td>
                  </tr>
                ) : logsData && logsData.logs.length > 0 ? (
                  logsData.logs.map((log: EmailLogRow) => (
                    <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-[14px] text-[#343434] dark:text-white whitespace-nowrap">{log.to}</td>
                      <td className="px-6 py-4 text-[14px] text-[#495057] dark:text-gray-300 max-w-xs truncate">{log.subject}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center gap-2">
                          {statusBadge(log.status)}
                          {bounceBadge(log.bounceType)}
                        </div>
                        {log.error && <p className="text-[11px] text-red-500 mt-1 max-w-xs truncate">{log.error}</p>}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {log.deliveredAt ? format(new Date(log.deliveredAt), "MMM d, hh:mm a") : "—"}
                      </td>
                      <td className="px-6 py-4 text-[13px] text-gray-500 dark:text-gray-400">{log.openCount || "—"}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-500 dark:text-gray-400">{log.clickCount || "—"}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {format(new Date(log.createdAt), "MMM d, hh:mm a")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={7} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Info className="w-10 h-10 text-gray-300" />
                        <span className="text-gray-500 font-medium">No email activity found</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {logsData && logsData.meta.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-slate-700">
              <span className="text-[12px] text-gray-500 dark:text-gray-400">
                Page {logsData.meta.page} of {logsData.meta.pages} ({logsData.meta.total} total)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-[12px] font-semibold rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-40 text-gray-700 dark:text-gray-200"
                >
                  Previous
                </button>
                <button
                  disabled={page >= logsData.meta.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-[12px] font-semibold rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-40 text-gray-700 dark:text-gray-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Dead-letter Queue table */}
      {tab === "dead" && (
        <div className="bg-white dark:bg-slate-800 rounded-[22px] shadow-sm border border-gray-100 dark:border-slate-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#F8F9FA] dark:bg-slate-700/50">
                  {["Recipient", "Subject", "Attempts", "Last Error", "Last Attempt"].map((h) => (
                    <th key={h} className="px-6 py-4 text-[13px] font-semibold text-[#495057] dark:text-gray-300 uppercase tracking-wider border-b border-gray-100 dark:border-slate-700 whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {deadLoading ? (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <Loader2 className="w-8 h-8 animate-spin mx-auto text-[#030213] dark:text-white" />
                    </td>
                  </tr>
                ) : deadData && deadData.items.length > 0 ? (
                  deadData.items.map((item) => (
                    <tr key={item.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                      <td className="px-6 py-4 text-[14px] text-[#343434] dark:text-white whitespace-nowrap">{item.to}</td>
                      <td className="px-6 py-4 text-[14px] text-[#495057] dark:text-gray-300 max-w-xs truncate">{item.subject}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-500 dark:text-gray-400">{item.attempts}/{item.maxAttempts}</td>
                      <td className="px-6 py-4 text-[13px] text-red-500 max-w-xs truncate">{item.lastError || "—"}</td>
                      <td className="px-6 py-4 text-[13px] text-gray-500 dark:text-gray-400 whitespace-nowrap">
                        {format(new Date(item.updatedAt), "MMM d, hh:mm a")}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <Info className="w-10 h-10 text-gray-300" />
                        <span className="text-gray-500 font-medium">Nothing in the dead-letter queue</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {deadData && deadData.meta.pages > 1 && (
            <div className="flex items-center justify-between px-6 py-3 border-t border-gray-100 dark:border-slate-700">
              <span className="text-[12px] text-gray-500 dark:text-gray-400">
                Page {deadData.meta.page} of {deadData.meta.pages} ({deadData.meta.total} total)
              </span>
              <div className="flex gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  className="px-3 py-1.5 text-[12px] font-semibold rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-40 text-gray-700 dark:text-gray-200"
                >
                  Previous
                </button>
                <button
                  disabled={page >= deadData.meta.pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="px-3 py-1.5 text-[12px] font-semibold rounded-lg border border-gray-200 dark:border-slate-700 disabled:opacity-40 text-gray-700 dark:text-gray-200"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </section>
  );
};

export default SuperAdminEmailAnalytics;
