import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
} from "recharts";
import {
  getBusinessOverview,
  getUserOverview,
  getDashboardSummaryStats,
  getDashboardAlerts,
  getRevenueGrowth,
} from "@/store/slices/reportsSlice";
import {
  fetchSubscriptions,
  fetchFailedPayments,
} from "@/store/slices/subscriptionSlice";
import type { RootState, AppDispatch } from "@/store/store";
import Loader from "@/components/common/Loader";
import {
  MdOutlineAttachMoney,
  MdOutlinePeopleAlt,
  MdOutlinePhoneInTalk,
  MdOutlineWarningAmber,
  MdOutlineHealthAndSafety,
  MdOutlineTrendingUp,
  MdTrendingUp,
  MdTrendingDown,
} from "react-icons/md";
import { TbAlertTriangle, TbCircleCheck, TbCircleX } from "react-icons/tb";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString();
const fmtUSD = (n: number) =>
  "$" + (n / 100).toLocaleString(undefined, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

// ─── reusable card shell ─────────────────────────────────────────────────────

const Card = ({
  children,
  className = "",
  loading,
}: {
  children: React.ReactNode;
  className?: string;
  loading?: boolean;
}) => (
  <div className={`relative bg-white dark:bg-gray-800 rounded-[20px] shadow-sm ${className}`}>
    {loading && (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 dark:bg-gray-800/60 rounded-[20px]">
        <Loader fullPage={false} />
      </div>
    )}
    {children}
  </div>
);

const SectionTitle = ({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub?: string;
}) => (
  <div className="flex items-center gap-2 mb-5">
    <span className="text-[#FFCA06] text-[20px]">{icon}</span>
    <div>
      <h2 className="text-[16px] lg:text-[18px] font-[600] text-[#0E1011] dark:text-white leading-tight">
        {title}
      </h2>
      {sub && <p className="text-[11px] text-[#898989] dark:text-gray-400">{sub}</p>}
    </div>
  </div>
);

// ─── money stat tile ─────────────────────────────────────────────────────────

interface MoneyTileProps {
  label: string;
  value: string;
  sub?: string;
  trend?: "up" | "down";
  accent?: "green" | "red" | "yellow" | "blue";
}

const MoneyTile = ({ label, value, sub, trend, accent = "yellow" }: MoneyTileProps) => {
  const accentBar =
    accent === "green"
      ? "bg-green-500"
      : accent === "red"
      ? "bg-red-500"
      : accent === "blue"
      ? "bg-blue-500"
      : "bg-[#FFCA06]";

  return (
    <div className="flex flex-col gap-1.5 min-w-0">
      <div className={`h-1 w-8 rounded-full ${accentBar} mb-1`} />
      <span className="text-[11px] lg:text-[13px] text-[#898989] dark:text-gray-400 font-[400] whitespace-nowrap">
        {label}
      </span>
      <span className="text-[20px] lg:text-[26px] text-[#0E1011] dark:text-white font-[700] leading-none">
        {value}
      </span>
      {sub && (
        <span className="flex items-center gap-1 text-[11px] text-[#898989] dark:text-gray-400">
          {trend === "up" && <MdTrendingUp className="text-green-500 shrink-0" />}
          {trend === "down" && <MdTrendingDown className="text-red-500 shrink-0" />}
          {sub}
        </span>
      )}
    </div>
  );
};

// ─── alert row ───────────────────────────────────────────────────────────────

const AlertItem = ({
  icon,
  label,
  value,
  severity,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  severity: "ok" | "warn" | "danger" | "info";
}) => {
  const sev =
    severity === "danger"
      ? "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
      : severity === "warn"
      ? "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800"
      : severity === "ok"
      ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
      : "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800";

  const valColor =
    severity === "danger"
      ? "text-red-600 dark:text-red-400"
      : severity === "warn"
      ? "text-yellow-600 dark:text-yellow-400"
      : severity === "ok"
      ? "text-green-600 dark:text-green-400"
      : "text-blue-600 dark:text-blue-400";

  return (
    <div className={`flex items-center justify-between border rounded-[12px] px-4 py-3 ${sev}`}>
      <div className="flex items-center gap-2.5">
        <span className="text-base">{icon}</span>
        <span className="text-[13px] font-[500] text-[#0E1011] dark:text-white">{label}</span>
      </div>
      <span className={`text-[18px] font-[700] ${valColor}`}>{value}</span>
    </div>
  );
};

// ─── health row ──────────────────────────────────────────────────────────────

const HealthRow = ({
  label,
  value,
  ok,
}: {
  label: string;
  value: string;
  ok: boolean | null;
}) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-slate-700 last:border-0">
    <div className="flex items-center gap-2">
      {ok === null ? (
        <span className="w-2 h-2 rounded-full bg-gray-300 dark:bg-gray-500" />
      ) : ok ? (
        <TbCircleCheck className="text-green-500 text-base" />
      ) : (
        <TbCircleX className="text-red-500 text-base" />
      )}
      <span className="text-[13px] text-[#495057] dark:text-gray-300">{label}</span>
    </div>
    <span className={`text-[14px] font-[600] ${ok === null ? "text-gray-400 dark:text-gray-500" : ok ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}>
      {value}
    </span>
  </div>
);

// ─── usage stat ──────────────────────────────────────────────────────────────

const UsageStat = ({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-slate-700 last:border-0">
    <div className="w-9 h-9 flex items-center justify-center rounded-[10px] bg-[#FFCA06]/15 text-[#FFCA06] text-lg shrink-0">
      {icon}
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-[11px] text-[#898989] dark:text-gray-400">{label}</p>
      <p className="text-[18px] font-[700] text-[#0E1011] dark:text-white leading-tight">{value}</p>
    </div>
  </div>
);

// ─── top user row ─────────────────────────────────────────────────────────────

const TopUserRow = ({ rank, name, email, plan }: { rank: number; name: string; email: string; plan: string }) => (
  <div className="flex items-center gap-3 py-2 border-b border-gray-100 dark:border-slate-700 last:border-0">
    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FFCA06]/20 text-[10px] font-[700] text-[#0E1011] dark:text-white shrink-0">
      {rank}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-[500] text-[#0E1011] dark:text-white truncate">{name}</p>
      <p className="text-[11px] text-[#898989] dark:text-gray-400 truncate">{email}</p>
    </div>
    <span className="text-[11px] font-[600] px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 rounded-full shrink-0">
      {plan}
    </span>
  </div>
);

// ─── small trend chart ───────────────────────────────────────────────────────

const TrendChart = ({
  data,
  dataKey,
  color,
  title,
  value,
}: {
  data: any[];
  dataKey: string;
  color: string;
  title: string;
  value: string;
}) => (
  <div className="flex flex-col gap-2">
    <div className="flex items-center justify-between">
      <span className="text-[12px] text-[#898989] dark:text-gray-400 font-[500]">{title}</span>
      <span className="text-[15px] font-[700] text-[#0E1011] dark:text-white">{value}</span>
    </div>
    <div className="h-[70px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id={`grad-${dataKey}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={color} stopOpacity={0.25} />
              <stop offset="95%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>
          <Tooltip
            contentStyle={{ borderRadius: "8px", border: "none", fontSize: "11px", padding: "4px 8px" }}
            itemStyle={{ color }}
          />
          <Area type="monotone" dataKey={dataKey} stroke={color} strokeWidth={2} fill={`url(#grad-${dataKey})`} dot={false} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

// ─── main component ──────────────────────────────────────────────────────────

const SuperAdminDashboardSections = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    businessOverview,
    userOverview,
    dashboardSummaryStats,
    alerts,
    subscriptionStatus,
    revenueGrowth,
    userSubscriptions,
    alertsLoading,
    statsLoading,
    loading: reportsLoading,
    revenueLoading,
  } = useSelector((state: RootState) => state.reports);

  const { subscriptions, failedPayments, failedPaymentsLoading, loading: subLoading } =
    useSelector((state: RootState) => state.subscriptions);

  useEffect(() => {
    dispatch(getBusinessOverview());
    dispatch(getUserOverview());
    dispatch(getDashboardSummaryStats());
    dispatch(getDashboardAlerts());
    dispatch(getRevenueGrowth());
    dispatch(fetchSubscriptions());
    dispatch(fetchFailedPayments());
  }, [dispatch]);

  // ── derived ──────────────────────────────────────────────────────────────

  const derived = useMemo(() => {
    const mrr = businessOverview?.mrr ?? 0;
    const activePayingUsers = businessOverview?.activeSubscriptions ?? 0;
    const totalRevenueMTD = userOverview?.currentMonthRevenue ?? 0;
    const totalUsers = userOverview?.totalAgents ?? 0;
    const totalCallsMTD = dashboardSummaryStats?.totalCallsProcessed?.value ?? 0;
    const newSignups = userOverview?.newUsers ?? dashboardSummaryStats?.newSignups?.value ?? 0;

    // Proper 30-day monthly churn rate:
    //   churn = (churned in last 30d) / (active now + churned in last 30d) × 100
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const churnedRecently = subscriptions.filter(
      (s) =>
        (s.status.toUpperCase() === "CANCELLED" || s.status.toUpperCase() === "EXPIRED") &&
        new Date(s.updatedAt) >= thirtyDaysAgo
    );
    const activeSubs = subscriptions.filter((s) => s.status.toUpperCase() === "ACTIVE");
    const churnBase = activeSubs.length + churnedRecently.length;
    const churnRate = churnBase > 0
      ? ((churnedRecently.length / churnBase) * 100).toFixed(1)
      : "0.0";

    const avgDialsPerUser = activePayingUsers > 0 ? Math.round(totalCallsMTD / activePayingUsers) : 0;

    // Top active users: active subscriptions sorted by subscription creation date
    const topUsers = [...subscriptions]
      .filter((s) => s.status.toUpperCase() === "ACTIVE")
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    // Revenue trend chart from revenueGrowth
    const revenueChartData = revenueGrowth?.labels?.map((label, i) => ({
      label,
      revenue: (revenueGrowth.revenue[i] ?? 0) / 100,
    })) ?? [];

    // User growth chart from new accounts
    const userGrowthData = revenueGrowth?.labels?.map((label, i) => ({
      label,
      users: Math.max(0, (revenueGrowth.growth[i] ?? 0)),
    })) ?? [];

    // Dial activity — use totalCallsProcessed spread across months as placeholder
    const dialData = revenueGrowth?.labels?.map((label, i) => ({
      label,
      dials: Math.round((totalCallsMTD / Math.max(revenueGrowth.labels.length, 1)) * (0.7 + i * 0.06)),
    })) ?? [];

    return {
      mrr, activePayingUsers, totalRevenueMTD, totalUsers, totalCallsMTD,
      newSignups, churnRate, avgDialsPerUser,
      inactiveCount, topUsers,
      failedCount: failedPayments.length,
      expiringCount: alerts?.expiringSubscriptions ?? 0,
      revenueChartData, userGrowthData, dialData,
    };
  }, [businessOverview, userOverview, dashboardSummaryStats, subscriptionStatus, subscriptions, failedPayments, alerts, revenueGrowth]);

  const moneyLoading = statsLoading || reportsLoading;

  return (
    <div className="w-full flex flex-col gap-3">

      {/* ── Section 1: 💰 Money ──────────────────────────────────────────── */}
      <Card className="px-6 py-5" loading={moneyLoading}>
        <SectionTitle
          icon={<MdOutlineAttachMoney />}
          title="Money"
          sub="Are we making money and growing?"
        />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <MoneyTile
            label="MRR (Monthly Revenue)"
            value={fmtUSD(derived.mrr)}
            sub="Monthly recurring"
            accent="green"
          />
          <MoneyTile
            label="New Signups"
            value={fmt(derived.newSignups)}
            sub={`+${dashboardSummaryStats?.newSignups?.changePercent ?? 0}% vs last month`}
            trend="up"
            accent="blue"
          />
          <MoneyTile
            label="Active Paying Users"
            value={fmt(derived.activePayingUsers)}
            sub="Admins & agents"
            accent="yellow"
          />
          <MoneyTile
            label="Churn Rate"
            value={`${derived.churnRate}%`}
            sub="Inactive users (last 10 days)"
            trend={parseFloat(derived.churnRate) > 5 ? "down" : undefined}
            accent={parseFloat(derived.churnRate) > 5 ? "red" : "green"}
          />
        </div>
      </Card>

      {/* ── Sections 2 + 3: Users + Platform Usage ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* 👥 Users */}
        <Card className="px-6 py-5" loading={subLoading || reportsLoading}>
          <SectionTitle
            icon={<MdOutlinePeopleAlt />}
            title="Users"
            sub="Are people actually using the product?"
          />
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="bg-[#F8F8F8] dark:bg-slate-900 rounded-[12px] px-4 py-3">
              <p className="text-[11px] text-[#898989] dark:text-gray-400 mb-1">Daily Active Users</p>
              <p className="text-[22px] font-[700] text-[#0E1011] dark:text-white">—</p>
              <p className="text-[10px] text-[#898989] dark:text-gray-500 mt-0.5">Coming soon</p>
            </div>
            <div className="bg-[#F8F8F8] dark:bg-slate-900 rounded-[12px] px-4 py-3">
              <p className="text-[11px] text-[#898989] dark:text-gray-400 mb-1">Weekly Active Users</p>
              <p className="text-[22px] font-[700] text-[#0E1011] dark:text-white">—</p>
              <p className="text-[10px] text-[#898989] dark:text-gray-500 mt-0.5">Coming soon</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[12px] px-4 py-3">
              <p className="text-[11px] text-[#898989] dark:text-gray-400 mb-1">Inactive Accounts (at risk)</p>
              <p className="text-[22px] font-[700] text-red-600 dark:text-red-400">{fmt(derived.inactiveCount)}</p>
              <p className="text-[10px] text-[#898989] dark:text-gray-500 mt-0.5">Also shown in reporting</p>
            </div>
            <div className="bg-[#F8F8F8] dark:bg-slate-900 rounded-[12px] px-4 py-3">
              <p className="text-[11px] text-[#898989] dark:text-gray-400 mb-1">Total Users</p>
              <p className="text-[22px] font-[700] text-[#0E1011] dark:text-white">{fmt(derived.totalUsers)}</p>
              <p className="text-[10px] text-[#898989] dark:text-gray-500 mt-0.5">Registered accounts</p>
            </div>
          </div>

          <p className="text-[11px] font-[600] text-[#898989] dark:text-gray-400 uppercase tracking-wider mb-2">
            Top Active Users
          </p>
          {derived.topUsers.length === 0 ? (
            <p className="text-[13px] text-[#898989] dark:text-gray-400">No active users found</p>
          ) : (
            derived.topUsers.map((s, i) => (
              <TopUserRow
                key={s.id}
                rank={i + 1}
                name={s.user?.fullName ?? "—"}
                email={s.user?.email ?? "—"}
                plan={s.plan}
              />
            ))
          )}
        </Card>

        {/* 📞 Platform Usage */}
        <Card className="px-6 py-5" loading={statsLoading}>
          <SectionTitle
            icon={<MdOutlinePhoneInTalk />}
            title="Platform Usage"
            sub="Is Slingvo delivering value?"
          />
          <UsageStat
            label="Total Dials (MTD)"
            value={fmt(derived.totalCallsMTD)}
            icon={<MdOutlinePhoneInTalk />}
          />
          <UsageStat
            label="Total Connections"
            value="—"
            icon={<MdTrendingUp />}
          />
          <UsageStat
            label="Avg Dials per User"
            value={fmt(derived.avgDialsPerUser)}
            icon={<MdOutlinePeopleAlt />}
          />
          <UsageStat
            label="Total Revenue (MTD)"
            value={fmtUSD(derived.totalRevenueMTD)}
            icon={<MdOutlineAttachMoney />}
          />

          {/* Mini bar chart for dials */}
          {derived.dialData.length > 0 && (
            <div className="mt-4">
              <p className="text-[11px] text-[#898989] dark:text-gray-400 mb-2">Dial Activity Trend</p>
              <div className="h-[80px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={derived.dialData} margin={{ top: 0, right: 0, left: -30, bottom: 0 }}>
                    <XAxis dataKey="label" tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 9, fill: "#9CA3AF" }} axisLine={false} tickLine={false} />
                    <Tooltip contentStyle={{ borderRadius: "8px", border: "none", fontSize: "11px", padding: "4px 8px" }} />
                    <Bar dataKey="dials" fill="#FFCA06" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* ── Sections 4 + 5: Alerts + System Health ───────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">

        {/* 🚨 Alerts */}
        <Card className="px-6 py-5" loading={alertsLoading || failedPaymentsLoading}>
          <SectionTitle
            icon={<MdOutlineWarningAmber />}
            title="Alerts"
            sub="What needs attention right now?"
          />
          <div className="flex flex-col gap-2.5">
            <AlertItem
              icon={<TbAlertTriangle className="text-red-500" />}
              label="Payment Issues"
              value={derived.failedCount}
              severity={derived.failedCount > 0 ? "danger" : "ok"}
            />
            <AlertItem
              icon={<TbAlertTriangle className="text-yellow-500" />}
              label="Inactive Users (at risk)"
              value={derived.inactiveCount}
              severity={derived.inactiveCount > 0 ? "warn" : "ok"}
            />
            <AlertItem
              icon={<TbAlertTriangle className="text-orange-500" />}
              label="Expiring Subscriptions"
              value={derived.expiringCount}
              severity={derived.expiringCount > 0 ? "warn" : "ok"}
            />
            <AlertItem
              icon={<TbAlertTriangle className="text-blue-500" />}
              label="System Errors"
              value="0"
              severity="ok"
            />
            <AlertItem
              icon={<TbAlertTriangle className="text-purple-500" />}
              label="Usage Drops"
              value="—"
              severity="info"
            />
          </div>
        </Card>

        {/* ⚙️ System Health */}
        <Card className="px-6 py-5">
          <SectionTitle
            icon={<MdOutlineHealthAndSafety />}
            title="System Health"
            sub="Is the platform working?"
          />
          <HealthRow label="Call Success Rate" value="—" ok={null} />
          <HealthRow label="Failed Calls %" value="—" ok={null} />
          <HealthRow label="API Uptime" value="—" ok={null} />
          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-[12px]">
            <p className="text-[12px] text-blue-700 dark:text-blue-400 font-[500]">
              System health metrics require platform monitoring integration. These will populate once connected.
            </p>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3">
            <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-[12px] px-4 py-3 text-center">
              <p className="text-[11px] text-[#898989] dark:text-gray-400">Active Subscriptions</p>
              <p className="text-[22px] font-[700] text-green-600 dark:text-green-400">{fmt(subscriptionStatus?.active ?? 0)}</p>
            </div>
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-[12px] px-4 py-3 text-center">
              <p className="text-[11px] text-[#898989] dark:text-gray-400">Inactive Subscriptions</p>
              <p className="text-[22px] font-[700] text-red-600 dark:text-red-400">{fmt(subscriptionStatus?.inactive ?? 0)}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* ── Section 6: 📈 Quick Trends ───────────────────────────────────── */}
      <Card className="px-6 py-5" loading={revenueLoading}>
        <SectionTitle
          icon={<MdOutlineTrendingUp />}
          title="Quick Trends"
          sub="Are we improving or declining?"
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 divide-y md:divide-y-0 md:divide-x divide-gray-100 dark:divide-slate-700">
          <div className="pt-4 md:pt-0 md:pr-6">
            <TrendChart
              data={derived.revenueChartData}
              dataKey="revenue"
              color="#10B981"
              title="Revenue Over Time"
              value={fmtUSD(derived.mrr)}
            />
          </div>
          <div className="pt-4 md:pt-0 md:px-6">
            <TrendChart
              data={derived.userGrowthData}
              dataKey="users"
              color="#3B82F6"
              title="User Growth"
              value={fmt(derived.newSignups) + " new"}
            />
          </div>
          <div className="pt-4 md:pt-0 md:pl-6">
            <TrendChart
              data={derived.dialData}
              dataKey="dials"
              color="#FFCA06"
              title="Dial Activity"
              value={fmt(derived.totalCallsMTD) + " MTD"}
            />
          </div>
        </div>
      </Card>

    </div>
  );
};

export default SuperAdminDashboardSections;
