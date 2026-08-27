import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export type A2PStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

export interface A2PDetails {
    legalBusinessName: string;
    businessType: string;
    ein: string;
    businessWebsite: string;
    businessAddress: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    contactFirstName: string;
    contactLastName: string;
    contactEmail: string;
    contactPhone: string;
}

interface A2PState {
    status: A2PStatus;
    rejectionReason: string | null;
    // Previous submission's form fields, decrypted EIN included. Populated
    // by fetchA2PDetails so the modal can prefill on re-open. null when
    // the admin has never submitted.
    details: A2PDetails | null;
    loading: boolean;
    error: string | null;
}

const initialState: A2PState = {
    status: 'NOT_STARTED',
    rejectionReason: null,
    details: null,
    loading: false,
    error: null,
};

export const fetchA2PStatus = createAsyncThunk(
    'a2p/fetchStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/a2p/status');
            return response.data; // { status, rejectionReason }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch A2P status');
        }
    }
);

/**
 * Fetch the previously-submitted A2P details so the form can prefill for
 * editing on resubmit. Returns null when nothing has ever been submitted.
 */
export const fetchA2PDetails = createAsyncThunk(
    'a2p/fetchDetails',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/a2p/details');
            return response.data as A2PDetails | null;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch A2P details');
        }
    }
);

export const submitA2PRegistration = createAsyncThunk(
    'a2p/submit',
    async (details: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/a2p/submit', details);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit A2P registration');
        }
    }
);

const a2pSlice = createSlice({
    name: 'a2p',
    initialState,
    reducers: {
        resetA2PState: (state) => {
            state.status = 'NOT_STARTED';
            state.rejectionReason = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder.addCase(fetchA2PStatus.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchA2PStatus.fulfilled, (state, action) => {
            state.loading = false;
            state.status = action.payload.status;
            state.rejectionReason = action.payload.rejectionReason || null;
        });
        builder.addCase(fetchA2PStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(fetchA2PDetails.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchA2PDetails.fulfilled, (state, action) => {
            state.loading = false;
            state.details = action.payload;
        });
        builder.addCase(fetchA2PDetails.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(submitA2PRegistration.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(submitA2PRegistration.fulfilled, (state) => {
            state.loading = false;
            state.status = 'PENDING';
        });
        builder.addCase(submitA2PRegistration.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { resetA2PState } = a2pSlice.actions;
export default a2pSlice.reducer;
