import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface UserOverviewData {
  newUsers: number;
  totalAgents: number;
  activeSubscriptions: number;
  currentMonthRevenue: number;
  totalRevenue: number;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface DashboardAlertsData {
  expiringSubscriptions: number;
  newCustomers: number;
}

export interface BusinessOverviewData {
  mrr: number;
  activeSubscriptions: number;
  activeUsers: number;
  totalAgents: number;
}

export interface RevenuePlan {
  plan: string;
  amount: number;
}

export interface SubscriptionStatusData {
  active: number;
  inactive: number;
}

export interface UserSubscriptionData {
  userName: string;
  email: string;
  subscriptionPlan: string;
  status: string;
  createdAt: string;
}

export interface BillingReportDetail {
  userName: string;
  email: string;
  plan: string;
  status: string;
  totalBilled: number;
  lastPayment: string;
  invoiceStatus: string;
}

export interface RevenueGrowthData {
  labels: string[];
  revenue: number[]; // contracted / MRR (from subscriptions)
  collected: number[]; // actually collected (from the Billing ledger)
  growth: number[];
}

export interface StatItem {
  value: number;
  changePercent: number;
  comparison: string;
}

export interface DashboardSummaryStats {
  totalRevenue: StatItem;
  activeSubscriptions: StatItem;
  newSignups: StatItem;
  totalCallsProcessed: StatItem;
}

export interface PlanChangeRecord {
  id: string;
  userId: string;
  fromPlan: string;
  toPlan: string;
  fromAmount: number;
  toAmount: number;
  changeType: "UPGRADE" | "DOWNGRADE";
  changedAt: string;
  user: { fullName: string | null; email: string } | null;
}

export interface PlanChangesData {
  upgrades: number;
  downgrades: number;
  recent: PlanChangeRecord[];
}

interface ReportsState {
  userOverview: UserOverviewData | null;
  businessOverview: BusinessOverviewData | null;
  thisMonthChart: ChartData | null;
  lastMonthChart: ChartData | null;
  alerts: DashboardAlertsData | null;
  subscriptionStatus: SubscriptionStatusData | null;
  userSubscriptions: UserSubscriptionData[];
  billingReportDetail: BillingReportDetail[];
  revenueGrowth: RevenueGrowthData | null;
  revenuePlans: RevenuePlan[];
  dashboardSummaryStats: DashboardSummaryStats | null;
  // new metrics
  totalConnections: { current: number; previous: number } | null;
  appointmentsSet: { current: number; previous: number } | null;
  avgDaysSinceActive: number | null;
  planChanges: PlanChangesData | null;
  adminInvoices: any[];
  adminSubscriptions: any[];
  activeUsers: { dau: number; wau: number } | null;
  callStats: { total: number; completed: number; failed: number; successRate: number; failedRate: number; callsToday: number } | null;
  // loading flags
  loading: boolean;
  chartLoading: boolean;
  alertsLoading: boolean;
  tableLoading: boolean;
  subscriptionStatusLoading: boolean;
  billingLoading: boolean;
  revenueLoading: boolean;
  statsLoading: boolean;
  connectionsLoading: boolean;
  appointmentsLoading: boolean;
  avgDaysLoading: boolean;
  planChangesLoading: boolean;
  adminInvoicesLoading: boolean;
  adminSubscriptionsLoading: boolean;
  activeUsersLoading: boolean;
  callStatsLoading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  userOverview: null,
  businessOverview: null,
  thisMonthChart: null,
  lastMonthChart: null,
  alerts: null,
  subscriptionStatus: null,
  userSubscriptions: [],
  billingReportDetail: [],
  revenueGrowth: null,
  revenuePlans: [],
  dashboardSummaryStats: null,
  totalConnections: null,
  appointmentsSet: null,
  avgDaysSinceActive: null,
  planChanges: null,
  adminInvoices: [],
  adminSubscriptions: [],
  activeUsers: null,
  callStats: null,
  loading: false,
  chartLoading: false,
  alertsLoading: false,
  tableLoading: false,
  subscriptionStatusLoading: false,
  billingLoading: false,
  revenueLoading: false,
  statsLoading: false,
  connectionsLoading: false,
  appointmentsLoading: false,
  avgDaysLoading: false,
  planChangesLoading: false,
  adminInvoicesLoading: false,
  adminSubscriptionsLoading: false,
  activeUsersLoading: false,
  callStatsLoading: false,
  error: null,
};

export const getUserOverview = createAsyncThunk(
  "reports/getUserOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/user-overview");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch user overview",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getBusinessOverview = createAsyncThunk(
  "reports/getBusinessOverview",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/bussiness-overview");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch business overview",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getNewAccountsOverTime = createAsyncThunk(
  "reports/getNewAccountsOverTime",
  async (range: "THIS_MONTH" | "LAST_MONTH", { rejectWithValue }) => {
    try {
      const response = await api.get(`/report/new-accounts?range=${range}`);
      return { data: response.data.data, range };
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch new accounts analytics",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getDashboardAlerts = createAsyncThunk(
  "reports/getDashboardAlerts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/alerts");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch dashboard alerts",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getUserSubscriptions = createAsyncThunk(
  "reports/getUserSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/user-subscriptions");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch user subscriptions",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getUserSubscriptionStatus = createAsyncThunk(
  "reports/getUserSubscriptionStatus",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/user-subscription-status");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch subscription status",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getBillingReportDetail = createAsyncThunk(
  "reports/getBillingReportDetail",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/billing-report-detail");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch billing report detail",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getRevenueGrowth = createAsyncThunk(
  "reports/getRevenueGrowth",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/revenue-growth");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch revenue growth",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getRevenueByPlan = createAsyncThunk(
  "reports/getRevenueByPlan",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/revenue-plans");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch revenue plans",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getDashboardSummaryStats = createAsyncThunk(
  "reports/getDashboardSummaryStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/user-reports-billing");
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch summary stats",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const getTotalConnections = createAsyncThunk(
  "reports/getTotalConnections",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/total-connections");
      return response.data?.data as { current: number; previous: number };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getAppointmentsSet = createAsyncThunk(
  "reports/getAppointmentsSet",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/appointments-set");
      return response.data?.data as { current: number; previous: number };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getAvgDaysSinceActive = createAsyncThunk(
  "reports/getAvgDaysSinceActive",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/avg-days-since-active");
      return response.data?.data?.value as number | null;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getPlanChanges = createAsyncThunk(
  "reports/getPlanChanges",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/plan-changes");
      return response.data?.data as import("./reportsSlice").PlanChangesData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getActiveUsers = createAsyncThunk(
  "reports/getActiveUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/active-users");
      return response.data?.data as { dau: number; wau: number };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const getCallStats = createAsyncThunk(
  "reports/getCallStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/report/call-stats");
      return response.data?.data as { total: number; completed: number; failed: number; successRate: number; failedRate: number; callsToday: number };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchAdminInvoices = createAsyncThunk(
  "reports/fetchAdminInvoices",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/billing/invoices/admin-all");
      return response.data?.data?.invoices ?? [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const fetchAdminSubscriptions = createAsyncThunk(
  "reports/fetchAdminSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/billing/subscriptions/all");
      return response.data?.data ?? [];
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  },
);

export const reportsSlice = createSlice({
  name: "reports",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getUserOverview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getUserOverview.fulfilled, (state, action) => {
      state.loading = false;
      state.userOverview = action.payload?.data || null;
    });
    builder.addCase(getUserOverview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getBusinessOverview.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getBusinessOverview.fulfilled, (state, action) => {
      state.loading = false;
      state.businessOverview = action.payload?.data || null;
    });
    builder.addCase(getBusinessOverview.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getNewAccountsOverTime.pending, (state) => {
      state.chartLoading = true;
      state.error = null;
    });
    builder.addCase(getNewAccountsOverTime.fulfilled, (state, action) => {
      state.chartLoading = false;
      if (action.payload.range === "THIS_MONTH") {
        state.thisMonthChart = action.payload.data.chart;
      } else {
        state.lastMonthChart = action.payload.data.chart;
      }
    });
    builder.addCase(getNewAccountsOverTime.rejected, (state, action) => {
      state.chartLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getDashboardAlerts.pending, (state) => {
      state.alertsLoading = true;
      state.error = null;
    });
    builder.addCase(getDashboardAlerts.fulfilled, (state, action) => {
      state.alertsLoading = false;
      state.alerts = action.payload?.data?.alerts || null;
      if (action.payload?.data?.subscriptionStatus) {
        state.subscriptionStatus = action.payload?.data?.subscriptionStatus;
      }
    });
    builder.addCase(getDashboardAlerts.rejected, (state, action) => {
      state.alertsLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getUserSubscriptions.pending, (state) => {
      state.tableLoading = true;
      state.error = null;
    });
    builder.addCase(getUserSubscriptions.fulfilled, (state, action) => {
      state.tableLoading = false;
      state.userSubscriptions = action.payload?.data || [];
    });
    builder.addCase(getUserSubscriptions.rejected, (state, action) => {
      state.tableLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getUserSubscriptionStatus.pending, (state) => {
      state.subscriptionStatusLoading = true;
      state.error = null;
    });
    builder.addCase(getUserSubscriptionStatus.fulfilled, (state, action) => {
      state.subscriptionStatusLoading = false;
      state.subscriptionStatus = action.payload?.data || null;
    });
    builder.addCase(getUserSubscriptionStatus.rejected, (state, action) => {
      state.subscriptionStatusLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getBillingReportDetail.pending, (state) => {
      state.billingLoading = true;
      state.error = null;
    });
    builder.addCase(getBillingReportDetail.fulfilled, (state, action) => {
      state.billingLoading = false;
      const data = action.payload?.data;
      state.billingReportDetail = Array.isArray(data) ? data : (data?.data || []);
    });
    builder.addCase(getBillingReportDetail.rejected, (state, action) => {
      state.billingLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getRevenueGrowth.pending, (state) => {
      state.revenueLoading = true;
      state.error = null;
    });
    builder.addCase(getRevenueGrowth.fulfilled, (state, action) => {
      state.revenueLoading = false;
      state.revenueGrowth = action.payload?.data?.data || null;
    });
    builder.addCase(getRevenueGrowth.rejected, (state, action) => {
      state.revenueLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getRevenueByPlan.pending, (state) => {
      state.revenueLoading = true;
      state.error = null;
    });
    builder.addCase(getRevenueByPlan.fulfilled, (state, action) => {
      state.revenueLoading = false;
      state.revenuePlans = action.payload?.data?.plans || [];
    });
    builder.addCase(getRevenueByPlan.rejected, (state, action) => {
      state.revenueLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getDashboardSummaryStats.pending, (state) => {
      state.statsLoading = true;
      state.error = null;
    });
    builder.addCase(getDashboardSummaryStats.fulfilled, (state, action) => {
      state.statsLoading = false;
      const data = action.payload?.data;
      state.dashboardSummaryStats = data?.totalRevenue ? data : (data?.data || null);
    });
    builder.addCase(getDashboardSummaryStats.rejected, (state, action) => {
      state.statsLoading = false;
      state.error = action.payload as string;
    });

    builder.addCase(getTotalConnections.pending, (state) => { state.connectionsLoading = true; });
    builder.addCase(getTotalConnections.fulfilled, (state, action) => {
      state.connectionsLoading = false;
      state.totalConnections = action.payload ?? null;
    });
    builder.addCase(getTotalConnections.rejected, (state) => { state.connectionsLoading = false; });

    builder.addCase(getAppointmentsSet.pending, (state) => { state.appointmentsLoading = true; });
    builder.addCase(getAppointmentsSet.fulfilled, (state, action) => {
      state.appointmentsLoading = false;
      state.appointmentsSet = action.payload ?? null;
    });
    builder.addCase(getAppointmentsSet.rejected, (state) => { state.appointmentsLoading = false; });

    builder.addCase(getAvgDaysSinceActive.pending, (state) => { state.avgDaysLoading = true; });
    builder.addCase(getAvgDaysSinceActive.fulfilled, (state, action) => {
      state.avgDaysLoading = false;
      state.avgDaysSinceActive = action.payload ?? null;
    });
    builder.addCase(getAvgDaysSinceActive.rejected, (state) => { state.avgDaysLoading = false; });

    builder.addCase(getPlanChanges.pending, (state) => { state.planChangesLoading = true; });
    builder.addCase(getPlanChanges.fulfilled, (state, action) => {
      state.planChangesLoading = false;
      state.planChanges = action.payload ?? null;
    });
    builder.addCase(getPlanChanges.rejected, (state) => { state.planChangesLoading = false; });

    builder.addCase(fetchAdminInvoices.pending, (state) => { state.adminInvoicesLoading = true; });
    builder.addCase(fetchAdminInvoices.fulfilled, (state, action) => {
      state.adminInvoicesLoading = false;
      state.adminInvoices = action.payload;
    });
    builder.addCase(fetchAdminInvoices.rejected, (state) => { state.adminInvoicesLoading = false; });

    builder.addCase(fetchAdminSubscriptions.pending, (state) => { state.adminSubscriptionsLoading = true; });
    builder.addCase(fetchAdminSubscriptions.fulfilled, (state, action) => {
      state.adminSubscriptionsLoading = false;
      state.adminSubscriptions = action.payload;
    });
    builder.addCase(fetchAdminSubscriptions.rejected, (state) => { state.adminSubscriptionsLoading = false; });

    builder.addCase(getActiveUsers.pending, (state) => { state.activeUsersLoading = true; });
    builder.addCase(getActiveUsers.fulfilled, (state, action) => {
      state.activeUsersLoading = false;
      state.activeUsers = action.payload ?? null;
    });
    builder.addCase(getActiveUsers.rejected, (state) => { state.activeUsersLoading = false; });

    builder.addCase(getCallStats.pending, (state) => { state.callStatsLoading = true; });
    builder.addCase(getCallStats.fulfilled, (state, action) => {
      state.callStatsLoading = false;
      state.callStats = action.payload ?? null;
    });
    builder.addCase(getCallStats.rejected, (state) => { state.callStatsLoading = false; });
  },
});

export default reportsSlice.reducer;
