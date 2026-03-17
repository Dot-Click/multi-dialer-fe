import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export interface Subscription {
    id: string;
    userId: string;
    plan: string;
    status: string;
    startDate: string;
    endDate: string | null;
    zohooCustomerId: string;
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

export interface ZohoPlan {
    plan_code: string;
    plan_id: string;
    name: string;
    product_name: string;
    billing_mode: string;
    description: string;
    status: string;
    status_formatted: string;
    product_id: string;
    tax_id: string;
    tax_name: string;
    tax_percentage: number;
    tax_type: string;
    trial_period: number;
    setup_fee: number;
    setup_fee_account_id: string;
    setup_fee_account_name: string;
    account_id: string;
    account: string;
    recurring_price: number;
    pricing_scheme: string;
    pricing_scheme_formatted: string;
    price_brackets: Array<{ price: number }>;
    unit: string;
    interval: number;
    interval_unit: string;
    interval_unit_formatted: string;
    is_usage_enabled: boolean;
    billing_cycles: number;
    product_type: string;
    show_in_widget: boolean;
    store_description: string;
    store_markup_description: string;
    feature_details: {
        features: any[];
    };
    url: string;
    image_id: string;
    shipping_interval: number;
    shipping_interval_unit: string;
    group_name: string;
    internal_name: string;
    is_free_plan: boolean;
    created_time: string;
    created_time_formatted: string;
    created_at: string;
    created_at_formatted: string;
    updated_time: string;
    updated_time_formatted: string;
    addons: any[];
    custom_fields: any[];
}

interface SubscriptionState {
    subscriptions: Subscription[];
    plans: ZohoPlan[];
    loading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    subscriptions: [],
    plans: [],
    loading: false,
    error: null,
};

export const fetchSubscriptions = createAsyncThunk(
    'subscriptions/fetchList',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/subscriptions/list');
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
            const response = await api.get('/subscriptions/all');
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
            const response = await api.get('/subscriptions/auth');
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
            const response = await api.get('/subscriptions/billings');
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
    async (plan_code: string, { rejectWithValue }) => {
        try {
            const response = await api.post('/subscriptions', { plan_code });
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
            });
    },
});

export default subscriptionSlice.reducer;
