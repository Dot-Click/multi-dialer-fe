import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export type A2PStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

interface A2PState {
    status: A2PStatus;
    rejectionReason: string | null;
    loading: boolean;
    error: string | null;
}

const initialState: A2PState = {
    status: 'NOT_STARTED',
    rejectionReason: null,
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
