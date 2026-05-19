import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export interface Subscription {
    id: string;
    userId: string;
    plan: string;
    status: string;
    startDate: string;
    endDate: string | null;
    stripeCustomerId: string;
    usersCount: number;
    billingCycle: string;
    createdAt: string;
    updatedAt: string;
    billingId: string | null;
    amount?: string;
    user?: {
        id: string;
        fullName: string;
        email: string;
        role: string;
        status: string;
    };
}

export interface Plan {
    name: string;
    priceId: string;
}

interface SubscriptionState {
    subscriptions: Subscription[];
    plans: Plan[];
    billingPortalUrl: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    subscriptions: [],
    plans: [],
    billingPortalUrl: null,
    loading: false,
    error: null,
};

export const fetchSubscriptions = createAsyncThunk(
    'subscriptions/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/billing/subscriptions');
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch subscriptions');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch subscriptions');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const getAllSubscriptions = createAsyncThunk(
    'subscriptions/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/billing/subscriptions');
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch all subscriptions');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch all subscriptions');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const fetchToken = createAsyncThunk(
    'subscriptions/fetchToken',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/billing/auth');
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch token');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch token');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const fetchPlans = createAsyncThunk(
    'subscriptions/fetchPlans',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/billing/plans');
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch plans');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch plans');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const createSubscription = createAsyncThunk(
    'subscriptions/creates',
    async (priceId: string, { rejectWithValue }) => {
        try {
            const response = await api.post('/billing', { priceId });
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Failed to create subscription');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to create subscription');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const fetchBillingPortalUrl = createAsyncThunk(
    'subscriptions/fetchBillingPortalUrl',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/billing/portal');
            if (response.data.success) {
                return response.data.data.url;
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch billing portal URL');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch billing portal URL');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const subscriptionSlice = createSlice({
    name: 'subscriptions',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSubscriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchSubscriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.subscriptions = action.payload;
            })
            .addCase(fetchSubscriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchPlans.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchPlans.fulfilled, (state, action) => {
                state.loading = false;
                state.plans = action.payload;
            })
            .addCase(fetchPlans.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(createSubscription.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(createSubscription.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(createSubscription.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(getAllSubscriptions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getAllSubscriptions.fulfilled, (state, action) => {
                state.loading = false;
                state.subscriptions = action.payload;
            })
            .addCase(getAllSubscriptions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(fetchBillingPortalUrl.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchBillingPortalUrl.fulfilled, (state, action) => {
                state.loading = false;
                state.billingPortalUrl = action.payload;
            })
            .addCase(fetchBillingPortalUrl.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export default subscriptionSlice.reducer;
