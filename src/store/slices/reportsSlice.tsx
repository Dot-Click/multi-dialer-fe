import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface UserOverviewData {
  newUsers: number;
  totalAgents: number;
  activeSubscriptions: number;
  currentMonthRevenue: number;
}

export interface ChartData {
  labels: string[];
  values: number[];
}

export interface DashboardAlertsData {
  expiringSubscriptions: number;
  newCustomers: number;
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
  revenue: number[];
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

interface ReportsState {
  userOverview: UserOverviewData | null;
  thisMonthChart: ChartData | null;
  lastMonthChart: ChartData | null;
  alerts: DashboardAlertsData | null;
  subscriptionStatus: SubscriptionStatusData | null;
  userSubscriptions: UserSubscriptionData[];
  billingReportDetail: BillingReportDetail[];
  revenueGrowth: RevenueGrowthData | null;
  dashboardSummaryStats: DashboardSummaryStats | null;
  loading: boolean;
  chartLoading: boolean;
  alertsLoading: boolean;
  tableLoading: boolean;
  subscriptionStatusLoading: boolean;
  billingLoading: boolean;
  revenueLoading: boolean;
  statsLoading: boolean;
  error: string | null;
}

const initialState: ReportsState = {
  userOverview: null,
  thisMonthChart: null,
  lastMonthChart: null,
  alerts: null,
  subscriptionStatus: null,
  userSubscriptions: [],
  billingReportDetail: [],
  revenueGrowth: null,
  dashboardSummaryStats: null,
  loading: false,
  chartLoading: false,
  alertsLoading: false,
  tableLoading: false,
  subscriptionStatusLoading: false,
  billingLoading: false,
  revenueLoading: false,
  statsLoading: false,
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
  },
});

export default reportsSlice.reducer;
