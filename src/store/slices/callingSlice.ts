import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export interface CallHistoryItem {
    id: string;
    callSid: string;
    leadId: string | null;
    contactId: string | null;
    userId: string;
    sessionId: string | null;
    startTime: string;
    endTime: string;
    duration: number;
    status: string;
    disposition: string;
    recordingUrl: string;
    transcript: string | null;
    createdAt: string;
    updatedAt: string;
    contact: {
        id: string;
        fullName: string;
        city: string;
        state: string;
        zip: string;
        source: string;
        tags: any[];
        dataDialerId: string | null;
        createdAt: string;
        updatedAt: string;
    } | null;
}

interface CallingState {
    history: CallHistoryItem[];
    loading: boolean;
    error: string | null;
}

const initialState: CallingState = {
    history: [],
    loading: false,
    error: null,
};

export const getHistory = createAsyncThunk(
    'calling/getHistory',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/calling/getHistory');
            // Based on user prompt, response structure is { success: boolean, message: string, data: CallHistoryItem[] }
            return response.data.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch history');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const callingSlice = createSlice({
    name: 'calling',
    initialState,
    reducers: {
        clearHistory: (state) => {
            state.history = [];
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getHistory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getHistory.fulfilled, (state, action) => {
                state.loading = false;
                state.history = action.payload;
            })
            .addCase(getHistory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            });
    },
});

export const fetchCallerId = createAsyncThunk(
    'calling/fetchCallerId',
    async (callerId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/calling/getCallerId/${callerId}`);
            // Based on user prompt, response structure is { success: boolean, message: string, data: CallHistoryItem[] }
            return response.data.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Failed to fetch history');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);

export const { clearHistory } = callingSlice.actions;
export default callingSlice.reducer;
