import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

/**
 * Mirrors CnamStatus from the backend (multi-dialer-be/src/services/cnam.service.ts).
 * The blocked-* variants are the gate cascade: plan → subaccount →
 * business profile → voice integrity.
 */
export type CnamStatus =
    | 'not-started'
    | 'draft'
    | 'pending-review'
    | 'twilio-approved'
    | 'twilio-rejected'
    | 'blocked-no-twilio'
    | 'blocked-no-business-profile'
    | 'blocked-no-voice-integrity'
    | 'blocked-plan-not-eligible';

export interface CnamAttributes {
    displayName: string;
    useCase?: string;
    notes?: string;
}

interface CnamState {
    status: CnamStatus;
    displayName: string | null;
    rejectionReason: string | null;
    loading: boolean;
    error: string | null;
    lastFetchedAt: number | null;
}

const initialState: CnamState = {
    status: 'not-started',
    displayName: null,
    rejectionReason: null,
    loading: false,
    error: null,
    lastFetchedAt: null,
};

export const fetchCnamStatus = createAsyncThunk(
    'cnam/fetchStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/cnam/status');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch CNAM status');
        }
    }
);

export const submitCnamOnboarding = createAsyncThunk(
    'cnam/submit',
    async (attrs: CnamAttributes, { rejectWithValue }) => {
        try {
            const response = await api.post('/cnam/onboard', attrs);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit CNAM registration');
        }
    }
);

export const refreshCnamStatus = createAsyncThunk(
    'cnam/refresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/cnam/refresh');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to refresh CNAM status');
        }
    }
);

const cnamSlice = createSlice({
    name: 'cnam',
    initialState,
    reducers: {
        clearCnamError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        const apply = (state: CnamState, action: any) => {
            state.status = action.payload?.status || 'not-started';
            state.displayName = action.payload?.displayName || null;
            state.rejectionReason = action.payload?.rejectionReason || null;
            state.lastFetchedAt = Date.now();
        };

        builder.addCase(fetchCnamStatus.pending, (s) => { s.loading = true; s.error = null; });
        builder.addCase(fetchCnamStatus.fulfilled, (s, a) => { s.loading = false; apply(s, a); });
        builder.addCase(fetchCnamStatus.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });

        builder.addCase(submitCnamOnboarding.pending, (s) => { s.loading = true; s.error = null; });
        builder.addCase(submitCnamOnboarding.fulfilled, (s, a) => { s.loading = false; apply(s, a); });
        builder.addCase(submitCnamOnboarding.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });

        builder.addCase(refreshCnamStatus.pending, (s) => { s.loading = true; });
        builder.addCase(refreshCnamStatus.fulfilled, (s, a) => { s.loading = false; apply(s, a); });
        builder.addCase(refreshCnamStatus.rejected, (s, a) => { s.loading = false; s.error = a.payload as string; });
    },
});

export const { clearCnamError } = cnamSlice.actions;
export default cnamSlice.reducer;
