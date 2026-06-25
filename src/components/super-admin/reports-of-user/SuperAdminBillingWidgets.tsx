import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "@/store/store";
import {
  getBusinessOverview,
  getUserOverview,
  getDashboardSummaryStats,
  getTotalConnections,
  getAppointmentsSet,
  getAvgDaysSinceActive,
  getPlanChanges,
  fetchAdminInvoices,
  fetchAdminSubscriptions,
} from "@/store/slices/reportsSlice";
import {
  fetchFailedPayments,
  fetchUpcomingRenewals,
} from "@/store/slices/subscriptionSlice";
import Loader from "@/components/common/Loader";
import {
  TbTrendingUp,
  TbTrendingDown,
  TbAlertTriangle,
} from "react-icons/tb";
import {
  MdOutlineAttachMoney,
  MdOutlinePeopleAlt,
  MdOutlinePhoneInTalk,
  MdOutlineCreditCard,
  MdOutlineSwapHoriz,
  MdOutlineWarningAmber,
  MdOutlineLeaderboard,
  MdOutlineNotificationsActive,
} from "react-icons/md";

// ─── helpers ────────────────────────────────────────────────────────────────

const fmt = (n: number) => n.toLocaleString();
const fmtUSD = (n: number) =>
  "$" + (n / 100).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const pct = (n: number) => n.toFixed(1) + "%";

function calcChange(current: number, previous: number): string {
  if (previous === 0) return current > 0 ? "+100%" : "0%";
  const change = ((current - previous) / previous) * 100;
  return (change >= 0 ? "+" : "") + change.toFixed(1) + "%";
}

// ─── sub-components ──────────────────────────────────────────────────────────

interface SectionCardProps {
  title: string;
  icon: React.ReactNode;
  loading?: boolean;
  children: React.ReactNode;
}

const SectionCard = ({ title, icon, loading, children }: SectionCardProps) => (
  <div className="relative bg-white dark:bg-slate-800 rounded-[13.48px] shadow-sm px-[18px] py-[18px] lg:px-[28px] lg:py-[24px] w-full">
    {loading && (
      <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/50 dark:bg-slate-800/50 rounded-[13.48px]">
        <Loader fullPage={false} />
      </div>
    )}
    <div className="flex items-center gap-2 mb-5">
      <span className="text-[#FFCA06] text-xl">{icon}</span>
      <h3 className="text-[15px] lg:text-[17px] font-[600] text-[#2C2C2C] dark:text-white">
        {title}
      </h3>
    </div>
    {children}
  </div>
);

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  trend?: "up" | "down" | "neutral";
  highlight?: "green" | "red" | "yellow" | "blue" | "neutral";
}

const MetricCard = ({ label, value, sub, trend, highlight }: MetricCardProps) => {
  const highlightColor =
    highlight === "green"
      ? "border-l-green-500"
      : highlight === "red"
      ? "border-l-red-500"
      : highlight === "yellow"
      ? "border-l-yellow-400"
      : highlight === "blue"
      ? "border-l-blue-500"
      : highlight === "neutral"
      ? "border-l-gray-300 dark:border-l-slate-600"
      : "border-l-[#FFCA06]";

  return (
    <div className={`flex flex-col gap-1 border-l-4 ${highlightColor} pl-3`}>
      <span className="text-[10px] lg:text-[13px] text-[#898989] dark:text-gray-400 font-[400] whitespace-nowrap">
        {label}
      </span>
      <span className="text-[18px] lg:text-[22px] text-[#2C2C2C] dark:text-white font-[700]">
        {value}
      </span>
      {sub && (
        <span className="flex items-center gap-1 text-[10px] lg:text-[12px] text-[#898989] dark:text-gray-400">
          {trend === "up" && <TbTrendingUp className="text-green-500 shrink-0" />}
          {trend === "down" && <TbTrendingDown className="text-red-500 shrink-0" />}
          {sub}
        </span>
      )}
    </div>
  );
};

interface AlertRowProps {
  name: string;
  email: string;
  badge: string;
  badgeColor: string;
  amount?: string;
}

const AlertRow = ({ name, email, badge, badgeColor, amount }: AlertRowProps) => (
  <div className="flex items-center justify-between py-2.5 border-b border-gray-100 dark:border-slate-700 last:border-0">
    <div className="min-w-0 flex-1">
      <p className="text-[13px] font-[500] text-[#2C2C2C] dark:text-white truncate">{name}</p>
      <p className="text-[11px] text-[#898989] dark:text-gray-400 truncate">{email}</p>
    </div>
    <div className="flex items-center gap-2 shrink-0">
      {amount && (
        <span className="text-[12px] font-[600] text-[#2C2C2C] dark:text-white">{amount}</span>
      )}
      <span className={`text-[10px] font-[700] uppercase px-2 py-0.5 rounded-full ${badgeColor}`}>
        {badge}
      </span>
    </div>
  </div>
);

interface TopRowProps {
  rank: number;
  name: string;
  email: string;
  value: string;
  subValue?: string;
}

const TopRow = ({ rank, name, email, value, subValue }: TopRowProps) => (
  <div className="flex items-center gap-3 py-2.5 border-b border-gray-100 dark:border-slate-700 last:border-0">
    <span className="w-6 h-6 flex items-center justify-center rounded-full bg-[#FFCA06]/20 text-[11px] font-[700] text-[#2C2C2C] dark:text-white shrink-0">
      {rank}
    </span>
    <div className="flex-1 min-w-0">
      <p className="text-[13px] font-[500] text-[#2C2C2C] dark:text-white truncate">{name}</p>
      <p className="text-[11px] text-[#898989] dark:text-gray-400 truncate">{email}</p>
    </div>
    <div className="text-right shrink-0">
      <p className="text-[13px] font-[600] text-[#2C2C2C] dark:text-white">{value}</p>
      {subValue && <p className="text-[11px] text-[#898989] dark:text-gray-400">{subValue}</p>}
    </div>
  </div>
);

// ─── main component ───────────────────────────────────────────────────────────

const SuperAdminBillingWidgets = () => {
  const dispatch = useDispatch<AppDispatch>();

  const {
    businessOverview,
    userOverview,
    dashboardSummaryStats,
    statsLoading,
    loading: reportsLoading,
    totalConnections,
    appointmentsSet,
    avgDaysSinceActive,
    planChanges,
    adminInvoices,
    adminSubscriptions,
    connectionsLoading,
    appointmentsLoading,
    avgDaysLoading,
    planChangesLoading,
    adminInvoicesLoading,
    adminSubscriptionsLoading,
  } = useSelector((state: RootState) => state.reports);

  const {
    failedPayments,
    upcomingRenewals,
    failedPaymentsLoading,
    upcomingRenewalsLoading,
  } = useSelector((state: RootState) => state.subscriptions);

  useEffect(() => {
    dispatch(getBusinessOverview());
    dispatch(getUserOverview());
    dispatch(getDashboardSummaryStats());
    dispatch(getTotalConnections());
    dispatch(getAppointmentsSet());
    dispatch(getAvgDaysSinceActive());
    dispatch(getPlanChanges());
    dispatch(fetchAdminInvoices());
    dispatch(fetchAdminSubscriptions());
    dispatch(fetchFailedPayments());
    dispatch(fetchUpcomingRenewals());
  }, [dispatch]);

  // ── derived metrics ────────────────────────────────────────────────────────

  const metrics = useMemo(() => {
    const mrr = businessOverview?.mrr ?? 0;
    const activePayingUsers = businessOverview?.activeSubscriptions ?? 0;
    const totalRevenueMTD = userOverview?.currentMonthRevenue ?? dashboardSummaryStats?.totalRevenue?.value ?? 0;
    const totalUsers = userOverview?.totalAgents ?? businessOverview?.totalAgents ?? 0;
    const totalDialsMTD = dashboardSummaryStats?.totalCallsProcessed?.value ?? 0;
    const newSubs = dashboardSummaryStats?.newSignups?.value ?? 0;
    const arpu = activePayingUsers > 0 ? mrr / activePayingUsers : 0;
    const avgCallsPerAccount = activePayingUsers > 0 ? Math.round(totalDialsMTD / activePayingUsers) : 0;

    // Billing status from admin invoices
    const paidInvoices = adminInvoices.filter((inv: any) => inv.status === "paid");
    const pastDueInvoices = adminInvoices.filter(
      (inv: any) => inv.status === "open" || inv.status === "past_due"
    );
    const successfulPayments = paidInvoices.length;
    const pastDueCount = pastDueInvoices.length;
    const upcomingChargesCount = upcomingRenewals.length;

    // Subscription changes from admin subscriptions
    const canceledSubs = adminSubscriptions.filter(
      (s: any) => s.status.toUpperCase() === "CANCELLED" || s.status.toUpperCase() === "EXPIRED"
    );
    const cancellationsCount = canceledSubs.length;

    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const recentlyChurned = canceledSubs.filter(
      (s: any) => new Date(s.updatedAt) >= thirtyDaysAgo
    );
    const activeSubsCount = adminSubscriptions.filter((s: any) => s.status.toUpperCase() === "ACTIVE").length;
    const churnBase = activeSubsCount + recentlyChurned.length;
    const churnRate = churnBase > 0 ? (recentlyChurned.length / churnBase) * 100 : 0;
    const accountsAtRisk = failedPayments.length + pastDueCount;

    // Upgrades / downgrades from plan changes ledger
    const upgradesCount = planChanges?.upgrades ?? 0;
    const downgradesCount = planChanges?.downgrades ?? 0;

    // Top paying customers — aggregate paid amount by customer
    const payByCustomer: Record<string, { name: string; email: string; paid: number; plan: string }> = {};
    adminInvoices.forEach((inv: any) => {
      if (!inv.customerId) return;
      if (!payByCustomer[inv.customerId]) {
        payByCustomer[inv.customerId] = {
          name: inv.customerName ?? "—",
          email: inv.customerEmail ?? "—",
          paid: 0,
          plan: inv.plan ?? "—",
        };
      }
      payByCustomer[inv.customerId].paid += inv.amount_paid ?? 0;
    });
    const topPaying = Object.values(payByCustomer)
      .sort((a, b) => b.paid - a.paid)
      .slice(0, 5);

    // Highest usage — by usersCount
    const topUsage = [...adminSubscriptions]
      .sort((a: any, b: any) => (b.usersCount ?? 0) - (a.usersCount ?? 0))
      .slice(0, 5);

    // Fastest growing — most recently created active subs
    const fastestGrowing = [...adminSubscriptions]
      .filter((s: any) => s.status.toUpperCase() === "ACTIVE")
      .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      .slice(0, 5);

    return {
      mrr, activePayingUsers, totalRevenueMTD, arpu,
      totalUsers, totalDialsMTD, newSubs, avgCallsPerAccount,
      successfulPayments, failedCount: failedPayments.length, pastDueCount, upcomingChargesCount,
      cancellationsCount, churnRate, accountsAtRisk,
      upgradesCount, downgradesCount,
      topPaying, topUsage, fastestGrowing,
      canceledSubs,
      inactiveSubs: adminSubscriptions.filter(
        (s: any) => s.status.toUpperCase() === "CANCELLED" || s.status.toUpperCase() === "EXPIRED"
      ).length,
    };
  }, [
    businessOverview, userOverview, dashboardSummaryStats,
    adminSubscriptions, adminInvoices, failedPayments, upcomingRenewals, planChanges,
  ]);

  const anyLoading =
    statsLoading || reportsLoading || adminInvoicesLoading || adminSubscriptionsLoading ||
    failedPaymentsLoading || upcomingRenewalsLoading;

  return (
    <div className="w-full flex flex-col gap-4">

      {/* Row 1: Revenue Overview + User Activity */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <SectionCard title="Revenue Overview" icon={<MdOutlineAttachMoney />} loading={statsLoading || reportsLoading}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <MetricCard
              label="MRR"
              value={fmtUSD(metrics.mrr)}
              sub="Monthly Recurring Revenue"
              highlight="green"
            />
            <MetricCard
              label="Total Revenue (MTD)"
              value={fmtUSD(metrics.totalRevenueMTD)}
              sub={`${(dashboardSummaryStats?.totalRevenue?.changePercent ?? 0) >= 0 ? "+" : ""}${dashboardSummaryStats?.totalRevenue?.changePercent ?? 0}% from last month`}
              trend="up"
              highlight="blue"
            />
            <MetricCard
              label="Active Paying Users"
              value={fmt(metrics.activePayingUsers)}
              sub="With active subscription"
              highlight="green"
            />
            <MetricCard
              label="ARPU"
              value={fmtUSD(metrics.arpu)}
              sub="Avg Revenue Per User"
              highlight="yellow"
            />
          </div>
        </SectionCard>

        <SectionCard title="User Activity" icon={<MdOutlinePeopleAlt />} loading={reportsLoading}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <MetricCard
              label="Total Users"
              value={fmt(metrics.totalUsers)}
              sub="Registered accounts"
              highlight="blue"
            />
            <MetricCard
              label="New Signups (MTD)"
              value={fmt(metrics.newSubs)}
              sub={`${(dashboardSummaryStats?.newSignups?.changePercent ?? 0) >= 0 ? "+" : ""}${dashboardSummaryStats?.newSignups?.changePercent ?? 0}% from last month`}
              trend="up"
              highlight="green"
            />
            <MetricCard
              label="Active Paying Users"
              value={fmt(metrics.activePayingUsers)}
              sub="Subscribed this month"
              highlight="green"
            />
            <MetricCard
              label="Avg Dials per User"
              value={fmt(metrics.avgCallsPerAccount)}
              sub="Based on active accounts"
              highlight="yellow"
            />
          </div>
        </SectionCard>
      </div>

      {/* Row 2: Usage Performance + Billing Status */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <SectionCard title="Usage Performance" icon={<MdOutlinePhoneInTalk />} loading={statsLoading || connectionsLoading || appointmentsLoading}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <MetricCard
              label="Total Dials (MTD)"
              value={fmt(metrics.totalDialsMTD)}
              sub={`${(dashboardSummaryStats?.totalCallsProcessed?.changePercent ?? 0) >= 0 ? "+" : ""}${dashboardSummaryStats?.totalCallsProcessed?.changePercent ?? 0}% from last month`}
              trend="up"
              highlight="blue"
            />
            <MetricCard
              label="Total Connections (MTD)"
              value={fmt(totalConnections?.current ?? 0)}
              sub={
                totalConnections
                  ? `${calcChange(totalConnections.current, totalConnections.previous)} from last month`
                  : "Answered calls"
              }
              trend={
                totalConnections && totalConnections.current >= totalConnections.previous
                  ? "up"
                  : "down"
              }
              highlight="green"
            />
            <MetricCard
              label="Appointments Set (MTD)"
              value={fmt(appointmentsSet?.current ?? 0)}
              sub={
                appointmentsSet
                  ? `${calcChange(appointmentsSet.current, appointmentsSet.previous)} from last month`
                  : "Calendar appointments"
              }
              trend={
                appointmentsSet && appointmentsSet.current >= appointmentsSet.previous
                  ? "up"
                  : "down"
              }
              highlight="yellow"
            />
            <MetricCard
              label="Avg Calls per Account"
              value={fmt(metrics.avgCallsPerAccount)}
              sub="Total dials ÷ active accounts"
              highlight="yellow"
            />
          </div>
        </SectionCard>

        <SectionCard title="Billing Status" icon={<MdOutlineCreditCard />} loading={adminInvoicesLoading || failedPaymentsLoading || upcomingRenewalsLoading}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <MetricCard
              label="Successful Payments"
              value={fmt(metrics.successfulPayments)}
              sub="Paid invoices"
              highlight="green"
            />
            <MetricCard
              label="Failed Payments"
              value={fmt(metrics.failedCount)}
              sub={metrics.failedCount > 0 ? "Needs attention" : "All clear"}
              trend={metrics.failedCount > 0 ? "down" : undefined}
              highlight={metrics.failedCount > 0 ? "red" : "green"}
            />
            <MetricCard
              label="Past Due Accounts"
              value={fmt(metrics.pastDueCount)}
              sub="Open / past due invoices"
              highlight={metrics.pastDueCount > 0 ? "yellow" : "green"}
            />
            <MetricCard
              label="Upcoming Charges"
              value={fmt(metrics.upcomingChargesCount)}
              sub="Renewals due soon"
              highlight="blue"
            />
          </div>
        </SectionCard>
      </div>

      {/* Row 3: Subscription Changes + Churn & Risk */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">

        <SectionCard title="Subscription Changes" icon={<MdOutlineSwapHoriz />} loading={adminSubscriptionsLoading || planChangesLoading}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <MetricCard
              label="New Subscriptions"
              value={fmt(metrics.newSubs)}
              sub="This month"
              trend="up"
              highlight="green"
            />
            <MetricCard
              label="Upgrades (30d)"
              value={fmt(metrics.upgradesCount)}
              sub={metrics.upgradesCount > 0 ? "Plan upgrades" : "None this period"}
              trend={metrics.upgradesCount > 0 ? "up" : undefined}
              highlight={metrics.upgradesCount > 0 ? "green" : "neutral"}
            />
            <MetricCard
              label="Downgrades (30d)"
              value={fmt(metrics.downgradesCount)}
              sub={metrics.downgradesCount > 0 ? "Plan downgrades" : "None this period"}
              trend={metrics.downgradesCount > 0 ? "down" : undefined}
              highlight={metrics.downgradesCount > 0 ? "yellow" : "neutral"}
            />
            <MetricCard
              label="Cancellations"
              value={fmt(metrics.cancellationsCount)}
              sub="Canceled subscriptions"
              trend={metrics.cancellationsCount > 0 ? "down" : undefined}
              highlight={metrics.cancellationsCount > 0 ? "red" : "green"}
            />
          </div>
        </SectionCard>

        <SectionCard title="Churn & Risk" icon={<MdOutlineWarningAmber />} loading={adminSubscriptionsLoading || avgDaysLoading}>
          <div className="grid grid-cols-2 gap-x-8 gap-y-5">
            <MetricCard
              label="Churn Rate"
              value={pct(metrics.churnRate)}
              sub="Canceled ÷ total subs (30d)"
              trend={metrics.churnRate > 5 ? "down" : undefined}
              highlight={metrics.churnRate > 5 ? "red" : "green"}
            />
            <MetricCard
              label="Inactive Paying Users"
              value={fmt(metrics.inactiveSubs)}
              sub="Canceled / expired subs"
              highlight={metrics.inactiveSubs > 0 ? "yellow" : "green"}
            />
            <MetricCard
              label="Accounts at Risk"
              value={fmt(metrics.accountsAtRisk)}
              sub="Failed + past due"
              highlight={metrics.accountsAtRisk > 0 ? "red" : "green"}
            />
            <MetricCard
              label="Avg Days Since Login"
              value={avgDaysSinceActive !== null ? `${avgDaysSinceActive}d` : "—"}
              sub="Across all admin accounts"
              highlight={
                avgDaysSinceActive === null
                  ? "neutral"
                  : avgDaysSinceActive > 14
                  ? "yellow"
                  : "green"
              }
            />
          </div>
        </SectionCard>
      </div>

      {/* Row 4: Top Accounts */}
      <SectionCard title="Top Accounts" icon={<MdOutlineLeaderboard />} loading={adminInvoicesLoading || adminSubscriptionsLoading}>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

          <div>
            <p className="text-[12px] font-[600] text-[#898989] dark:text-gray-400 uppercase tracking-wider mb-3">
              Top Paying Customers
            </p>
            {metrics.topPaying.length === 0 ? (
              <p className="text-[13px] text-[#898989] dark:text-gray-400">No data yet</p>
            ) : (
              metrics.topPaying.map((c, i) => (
                <TopRow
                  key={i}
                  rank={i + 1}
                  name={c.name}
                  email={c.email}
                  value={fmtUSD(c.paid)}
                  subValue={c.plan}
                />
              ))
            )}
          </div>

          <div>
            <p className="text-[12px] font-[600] text-[#898989] dark:text-gray-400 uppercase tracking-wider mb-3">
              Highest Usage
            </p>
            {metrics.topUsage.length === 0 ? (
              <p className="text-[13px] text-[#898989] dark:text-gray-400">No data yet</p>
            ) : (
              metrics.topUsage.map((s: any, i: number) => (
                <TopRow
                  key={s.id}
                  rank={i + 1}
                  name={s.user?.fullName ?? "—"}
                  email={s.user?.email ?? "—"}
                  value={`${s.usersCount ?? 0} users`}
                  subValue={s.plan}
                />
              ))
            )}
          </div>

          <div>
            <p className="text-[12px] font-[600] text-[#898989] dark:text-gray-400 uppercase tracking-wider mb-3">
              Fastest Growing
            </p>
            {metrics.fastestGrowing.length === 0 ? (
              <p className="text-[13px] text-[#898989] dark:text-gray-400">No data yet</p>
            ) : (
              metrics.fastestGrowing.map((s: any, i: number) => (
                <TopRow
                  key={s.id}
                  rank={i + 1}
                  name={s.user?.fullName ?? "—"}
                  email={s.user?.email ?? "—"}
                  value={new Date(s.createdAt).toLocaleDateString()}
                  subValue={s.plan}
                />
              ))
            )}
          </div>
        </div>
      </SectionCard>

      {/* Row 5: Billing Alerts */}
      <SectionCard title="Billing Alerts" icon={<MdOutlineNotificationsActive />} loading={anyLoading}>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TbAlertTriangle className="text-red-500 text-sm" />
              <p className="text-[12px] font-[600] text-red-500 uppercase tracking-wider">
                Failed Payments ({failedPayments.length})
              </p>
            </div>
            {failedPayments.length === 0 ? (
              <p className="text-[13px] text-[#898989] dark:text-gray-400">None</p>
            ) : (
              failedPayments.slice(0, 4).map((fp) => (
                <AlertRow
                  key={fp.id}
                  name={fp.user?.fullName ?? "Unknown"}
                  email={fp.user?.email ?? "—"}
                  badge="Failed"
                  badgeColor="bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                  amount={fp.amount ? fmtUSD(parseFloat(fp.amount) * 100) : undefined}
                />
              ))
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TbAlertTriangle className="text-yellow-500 text-sm" />
              <p className="text-[12px] font-[600] text-yellow-500 uppercase tracking-wider">
                Past Due ({metrics.pastDueCount})
              </p>
            </div>
            {adminInvoices.filter((inv: any) => inv.status === "open" || inv.status === "past_due").length === 0 ? (
              <p className="text-[13px] text-[#898989] dark:text-gray-400">None</p>
            ) : (
              adminInvoices
                .filter((inv: any) => inv.status === "open" || inv.status === "past_due")
                .slice(0, 4)
                .map((inv: any) => (
                  <AlertRow
                    key={inv.id}
                    name={inv.customerName ?? "Unknown"}
                    email={inv.customerEmail ?? "—"}
                    badge="Past Due"
                    badgeColor="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    amount={fmtUSD(inv.amount_due ?? 0)}
                  />
                ))
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TbAlertTriangle className="text-orange-500 text-sm" />
              <p className="text-[12px] font-[600] text-orange-500 uppercase tracking-wider">
                Recently Canceled ({metrics.cancellationsCount})
              </p>
            </div>
            {metrics.canceledSubs.length === 0 ? (
              <p className="text-[13px] text-[#898989] dark:text-gray-400">None</p>
            ) : (
              metrics.canceledSubs.slice(0, 4).map((s: any) => (
                <AlertRow
                  key={s.id}
                  name={s.user?.fullName ?? "Unknown"}
                  email={s.user?.email ?? "—"}
                  badge="Canceled"
                  badgeColor="bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400"
                  amount={s.amount ? fmtUSD(parseFloat(s.amount) * 100) : undefined}
                />
              ))
            )}
          </div>

          <div>
            <div className="flex items-center gap-1.5 mb-3">
              <TbAlertTriangle className="text-purple-500 text-sm" />
              <p className="text-[12px] font-[600] text-purple-500 uppercase tracking-wider">
                Plan Changes ({(planChanges?.upgrades ?? 0) + (planChanges?.downgrades ?? 0)})
              </p>
            </div>
            {(planChanges?.recent?.length ?? 0) === 0 ? (
              <p className="text-[13px] text-[#898989] dark:text-gray-400">None in last 30 days</p>
            ) : (
              planChanges!.recent.slice(0, 4).map((pc) => (
                <AlertRow
                  key={pc.id}
                  name={pc.user?.fullName ?? "Unknown"}
                  email={pc.user?.email ?? "—"}
                  badge={pc.changeType}
                  badgeColor={
                    pc.changeType === "UPGRADE"
                      ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                      : "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                  }
                  amount={`$${pc.fromAmount} → $${pc.toAmount}`}
                />
              ))
            )}
          </div>
        </div>
      </SectionCard>

    </div>
  );
};

export default SuperAdminBillingWidgets;
