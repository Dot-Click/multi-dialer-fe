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
    stripeSubscriptionId?: string | null;
    trialEnd?: string | null;
    stripeStatus?: string | null;
    defaultPaymentMethodId?: string | null;
    cardBrand?: string | null;
    cardLast4?: string | null;
    cardExpMonth?: number | null;
    cardExpYear?: number | null;
    user?: {
        id: string;
        fullName: string;
        email: string;
        role: string;
        status: string;
        trialStatus?: 'ACTIVE' | 'EXPIRED' | 'NONE';
        isSubscribed?: boolean;
    };
}

export interface FailedPaymentRecord {
    id: string;
    userId: string;
    plan: string;
    amount: string | null;
    failedAt: string;
    stripeCustomerId: string | null;
    user: { fullName: string; email: string } | null;
}

export interface UpcomingRenewalRecord {
    id: string;
    userId: string;
    plan: string;
    amount: string | null;
    billingCycle: string;
    nextRenewalDate: string;
    user: { fullName: string; email: string } | null;
}

export interface InvoiceCard {
    brand: string | null;
    last4: string | null;
    expMonth: number | null;
    expYear: number | null;
}

export interface Invoice {
    id: string;
    number: string | null;
    plan?: string;
    paymentMethod?: InvoiceCard | null;
    amount_paid: number;
    amount_due: number;
    currency?: string;
    status: string | null;
    created: string;
    hosted_invoice_url: string | null;
    invoice_pdf: string | null;
}

export interface AllInvoice {
    id: string;
    number: string | null;
    customerId: string;
    customerName: string | null;
    customerEmail: string | null;
    plan: string;
    paymentMethod?: InvoiceCard | null;
    amount_paid: number;
    amount_due: number;
    currency: string;
    status: string | null;
    isOnTrial?: boolean;
    createdAt: string;
    created: string;
    hosted_invoice_url: string | null;
    invoice_pdf: string | null;
}

export interface InvoiceLineItem {
    id: string;
    description: string | null;
    quantity: number | null;
    unitAmount: number;
    amount: number;
    periodStart: string | null;
    periodEnd: string | null;
}

export interface InvoiceDetail {
    id: string;
    number: string | null;
    status: string | null;
    currency: string;
    accountName: string | null;
    sellerAddressLines: string[];
    sellerPhone: string | null;
    customerName: string | null;
    customerEmail: string | null;
    customerAddressLines: string[];
    customerPhone: string | null;
    description: string | null;
    created: string | null;
    dueDate: string | null;
    periodStart: string | null;
    periodEnd: string | null;
    subtotal: number;
    tax: number;
    total: number;
    amountPaid: number;
    amountDue: number;
    paymentMethod: {
        brand: string | null;
        last4: string | null;
        expMonth: number | null;
        expYear: number | null;
    } | null;
    lineItems: InvoiceLineItem[];
    hosted_invoice_url: string | null;
    invoice_pdf: string | null;
}

export interface Plan {
    id: string;
    plan: string;
    name: string;
    displayName: string;
    monthlyAmount: number;
    yearlyAmount: number;
    priceId: string;
    monthlyStripePriceId?: string;
    yearlyStripePriceId?: string;
    stripeProductId?: string;
    features: Array<{ text: string; enabled: boolean }>;
    isActive: boolean;
    isPopular: boolean;
}

interface SubscriptionState {
    subscriptions: Subscription[];
    plans: Plan[];
    billingPortalUrl: string | null;
    invoices: Record<string, Invoice[]>;
    invoicesLoading: Record<string, boolean>;
    allInvoices: AllInvoice[];
    allInvoicesLoading: boolean;
    stripeMode: 'live' | 'test' | null;
    invoiceDetail: InvoiceDetail | null;
    invoiceDetailLoading: boolean;
    userInvoices: AllInvoice[];
    userInvoicesLoading: boolean;
    invoiceCards: Record<string, InvoiceCard | null>;
    invoiceCardsLoading: Record<string, boolean>;
    failedPayments: FailedPaymentRecord[];
    failedPaymentsLoading: boolean;
    upcomingRenewals: UpcomingRenewalRecord[];
    upcomingRenewalsLoading: boolean;
    loading: boolean;
    error: string | null;
}

const initialState: SubscriptionState = {
    subscriptions: [],
    plans: [],
    billingPortalUrl: null,
    invoices: {},
    invoicesLoading: {},
    allInvoices: [],
    allInvoicesLoading: false,
    stripeMode: null,
    invoiceDetail: null,
    invoiceDetailLoading: false,
    userInvoices: [],
    userInvoicesLoading: false,
    invoiceCards: {},
    invoiceCardsLoading: {},
    failedPayments: [],
    failedPaymentsLoading: false,
    upcomingRenewals: [],
    upcomingRenewalsLoading: false,
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
            const response = await api.get('/billing/subscriptions/all');
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

export const updatePlanTier = createAsyncThunk(
    'subscriptions/updatePlanTier',
    async (
        payload: {
            plan: string;
            displayName: string;
            monthlyAmount: number;
            yearlyAmount: number;
            features: Array<{ text: string; enabled: boolean }>;
            isActive: boolean;
            isPopular: boolean;
        },
        { rejectWithValue },
    ) => {
        try {
            const { plan, ...body } = payload;
            const response = await api.put(`/billing/plans/${plan}`, body);
            if (response.data.success) {
                return response.data.data;
            } else {
                return rejectWithValue(response.data.message || 'Failed to update plan');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to update plan');
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

export const startSubscriptionCheckout = createAsyncThunk(
    'subscriptions/startSubscriptionCheckout',
    async (priceId: string, { rejectWithValue }) => {
        try {
            const response = await api.post('/billing/subscription/start', { priceId });
            if (response.data.success) {
                return response.data.data.url as string;
            } else {
                return rejectWithValue(response.data.message || 'Failed to start subscription checkout');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    },
);

export const changeSubscriptionPlan = createAsyncThunk(
    'subscriptions/changeSubscriptionPlan',
    async (payload: { subscriptionId: string; newPriceId: string; newPlan: string }, { rejectWithValue }) => {
        try {
            const { subscriptionId, newPriceId, newPlan } = payload;
            const response = await api.put(`/billing/subscription/${subscriptionId}/plan`, { newPriceId });
            if (response.data.success) {
                return { subscriptionId, newPlan: response.data.data?.newPlan ?? newPlan };
            } else {
                return rejectWithValue(response.data.message || 'Failed to change subscription plan');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to change subscription plan');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const createPlan = createAsyncThunk(
    'subscriptions/createPlan',
    async (
        payload: {
            name: string;
            description?: string;
            monthlyAmount?: number;
            yearlyAmount?: number;
            currency?: string;
            trialDays?: number;
        },
        { rejectWithValue },
    ) => {
        try {
            const response = await api.post('/billing/plans', payload);
            if (response.data.success) {
                return response.data.data as Plan;
            } else {
                return rejectWithValue(response.data.message || 'Failed to create plan');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to create plan');
            } else {
                return rejectWithValue(error.message);
            }
        }
    },
);

export const deletePlan = createAsyncThunk(
    'subscriptions/deletePlan',
    async (productId: string, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/billing/plans/${productId}`);
            if (response.data.success) {
                return productId;
            } else {
                return rejectWithValue(response.data.message || 'Failed to delete plan');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to delete plan');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const fetchInvoices = createAsyncThunk(
    'subscriptions/fetchInvoices',
    async (customerId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/billing/invoices?customerId=${customerId}`);
            if (response.data.success) {
                return { customerId, invoices: response.data.data as Invoice[] };
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch invoices');
            }
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch invoices');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const fetchAllInvoices = createAsyncThunk(
    'subscriptions/fetchAllInvoices',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/billing/invoices/admin-all');
            if (response.data.success) {
                return response.data.data as { mode: 'live' | 'test'; invoices: AllInvoice[] };
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch all invoices');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchInvoiceCard = createAsyncThunk(
    'subscriptions/fetchInvoiceCard',
    async (invoiceId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/billing/invoices/${invoiceId}/card`);
            if (response.data.success) {
                return { invoiceId, card: (response.data.data?.paymentMethod ?? null) as InvoiceCard | null };
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch invoice card');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchUserInvoices = createAsyncThunk(
    'subscriptions/fetchUserInvoices',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/billing/invoices/by-user/${userId}`);
            if (response.data.success) {
                return response.data.data as AllInvoice[];
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch user invoices');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchInvoiceDetail = createAsyncThunk(
    'subscriptions/fetchInvoiceDetail',
    async (invoiceId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/billing/invoices/${invoiceId}`);
            if (response.data.success) {
                return response.data.data as InvoiceDetail;
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch invoice detail');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchFailedPayments = createAsyncThunk(
    'subscriptions/fetchFailedPayments',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/billing/failed-payments');
            if (response.data.success) {
                return response.data.data as FailedPaymentRecord[];
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch failed payments');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const fetchUpcomingRenewals = createAsyncThunk(
    'subscriptions/fetchUpcomingRenewals',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/billing/upcoming-renewals');
            if (response.data.success) {
                return response.data.data as UpcomingRenewalRecord[];
            } else {
                return rejectWithValue(response.data.message || 'Failed to fetch upcoming renewals');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export interface CardSummary {
    brand: string | null;
    last4: string | null;
    expMonth: number | null;
    expYear: number | null;
}

export const createCardSetupIntent = createAsyncThunk(
    'subscriptions/createCardSetupIntent',
    async (userId: string, { rejectWithValue }) => {
        try {
            const response = await api.post(`/billing/subscription/${userId}/card/setup-intent`);
            if (response.data.success) {
                return response.data.data.clientSecret as string;
            } else {
                return rejectWithValue(response.data.message || 'Failed to start card setup');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateCardPaymentMethod = createAsyncThunk(
    'subscriptions/updateCardPaymentMethod',
    async (payload: { userId: string; paymentMethodId: string }, { rejectWithValue }) => {
        try {
            const { userId, paymentMethodId } = payload;
            const response = await api.post(`/billing/subscription/${userId}/card`, { paymentMethodId });
            if (response.data.success) {
                return { userId, card: response.data.data.card as CardSummary };
            } else {
                return rejectWithValue(response.data.message || 'Failed to update card');
            }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
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
    reducers: {
        clearInvoiceDetail: (state) => {
            state.invoiceDetail = null;
            state.invoiceDetailLoading = false;
        },
        clearUserInvoices: (state) => {
            state.userInvoices = [];
            state.userInvoicesLoading = false;
        },
    },
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
            .addCase(updatePlanTier.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updatePlanTier.fulfilled, (state, action) => {
                state.loading = false;
                const updated = action.payload;
                const index = state.plans.findIndex((plan) => {
                    const currentProductId = plan.stripeProductId || plan.id;
                    const updatedProductId = updated.stripeProductId || updated.id;
                    return currentProductId === updatedProductId;
                });
                if (index >= 0) {
                    state.plans[index] = updated;
                } else {
                    state.plans.push(updated);
                }
            })
            .addCase(updatePlanTier.rejected, (state, action) => {
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
            .addCase(createPlan.fulfilled, (state, action) => {
                state.plans.push(action.payload);
            })
            .addCase(deletePlan.fulfilled, (state, action) => {
                state.plans = state.plans.filter(
                    (p) => (p.stripeProductId || p.id) !== action.payload
                );
            })
            .addCase(fetchInvoices.pending, (state, action) => {
                state.invoicesLoading[action.meta.arg] = true;
            })
            .addCase(fetchInvoices.fulfilled, (state, action) => {
                const { customerId, invoices } = action.payload;
                state.invoices[customerId] = invoices;
                state.invoicesLoading[customerId] = false;
            })
            .addCase(fetchInvoices.rejected, (state, action) => {
                state.invoicesLoading[action.meta.arg] = false;
            })
            .addCase(fetchAllInvoices.pending, (state) => {
                state.allInvoicesLoading = true;
            })
            .addCase(fetchAllInvoices.fulfilled, (state, action) => {
                state.allInvoicesLoading = false;
                state.allInvoices = action.payload.invoices;
                state.stripeMode = action.payload.mode;
            })
            .addCase(fetchAllInvoices.rejected, (state) => {
                state.allInvoicesLoading = false;
            })
            .addCase(fetchInvoiceCard.pending, (state, action) => {
                state.invoiceCardsLoading[action.meta.arg] = true;
            })
            .addCase(fetchInvoiceCard.fulfilled, (state, action) => {
                const { invoiceId, card } = action.payload;
                state.invoiceCards[invoiceId] = card;
                state.invoiceCardsLoading[invoiceId] = false;
            })
            .addCase(fetchInvoiceCard.rejected, (state, action) => {
                state.invoiceCardsLoading[action.meta.arg] = false;
            })
            .addCase(fetchUserInvoices.pending, (state) => {
                state.userInvoicesLoading = true;
                state.userInvoices = [];
            })
            .addCase(fetchUserInvoices.fulfilled, (state, action) => {
                state.userInvoicesLoading = false;
                state.userInvoices = action.payload;
            })
            .addCase(fetchUserInvoices.rejected, (state) => {
                state.userInvoicesLoading = false;
            })
            .addCase(fetchInvoiceDetail.pending, (state) => {
                state.invoiceDetailLoading = true;
                state.invoiceDetail = null;
            })
            .addCase(fetchInvoiceDetail.fulfilled, (state, action) => {
                state.invoiceDetailLoading = false;
                state.invoiceDetail = action.payload;
            })
            .addCase(fetchInvoiceDetail.rejected, (state) => {
                state.invoiceDetailLoading = false;
            })
            .addCase(changeSubscriptionPlan.fulfilled, (state, action) => {
                const { subscriptionId, newPlan } = action.payload;
                const sub = state.subscriptions.find((s) => s.stripeSubscriptionId === subscriptionId);
                if (sub) sub.plan = newPlan;
            })
            .addCase(fetchFailedPayments.pending, (state) => {
                state.failedPaymentsLoading = true;
            })
            .addCase(fetchFailedPayments.fulfilled, (state, action) => {
                state.failedPaymentsLoading = false;
                state.failedPayments = action.payload;
            })
            .addCase(fetchFailedPayments.rejected, (state) => {
                state.failedPaymentsLoading = false;
            })
            .addCase(fetchUpcomingRenewals.pending, (state) => {
                state.upcomingRenewalsLoading = true;
            })
            .addCase(fetchUpcomingRenewals.fulfilled, (state, action) => {
                state.upcomingRenewalsLoading = false;
                state.upcomingRenewals = action.payload;
            })
            .addCase(fetchUpcomingRenewals.rejected, (state) => {
                state.upcomingRenewalsLoading = false;
            })
            .addCase(updateCardPaymentMethod.fulfilled, (state, action) => {
                const { userId, card } = action.payload;
                const sub = state.subscriptions.find((s) => s.userId === userId);
                if (sub) {
                    sub.cardBrand = card.brand;
                    sub.cardLast4 = card.last4;
                    sub.cardExpMonth = card.expMonth;
                    sub.cardExpYear = card.expYear;
                }
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

export const { clearInvoiceDetail, clearUserInvoices } = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
