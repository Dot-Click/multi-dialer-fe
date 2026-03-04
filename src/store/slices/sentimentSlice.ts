import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface SentimentData {
    aiSummary: string;
    sentiment: string;
    recordingUrl: string;
}

interface SentimentState {
    data: SentimentData | null;
    status: 'idle' | 'polling_status' | 'fetching_sentiment' | 'processing_sentiment' | 'succeeded' | 'failed';
    error: string | null;
}

const initialState: SentimentState = {
    data: null,
    status: 'idle',
    error: null,
};

export const fetchCallStatus = createAsyncThunk(
    'sentiment/fetchCallStatus',
    async (sid: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/calling/status/${sid}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch call status');
        }
    }
);

export const fetchCallSentiment = createAsyncThunk(
    'sentiment/fetchCallSentiment',
    async (sid: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/calling/sentiments/${sid}`);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch call sentiment');
        }
    }
);

export const sentimentSlice = createSlice({
    name: 'sentiment',
    initialState,
    reducers: {
        resetSentiment: (state) => {
            state.data = null;
            state.status = 'idle';
            state.error = null;
        },
        setPollingStatus: (state) => {
            state.status = 'polling_status';
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchCallSentiment.pending, (state) => {
                state.status = 'fetching_sentiment';
            })
            .addCase(fetchCallSentiment.fulfilled, (state, action) => {
                if (action.payload.data?.status === 'processing') {
                    state.status = 'processing_sentiment';
                    state.data = null;
                } else {
                    state.status = 'succeeded';
                    state.data = action.payload.data;
                }
            })
            .addCase(fetchCallSentiment.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload as string;
            });
    },
});

export const { resetSentiment, setPollingStatus } = sentimentSlice.actions;
export default sentimentSlice.reducer;
