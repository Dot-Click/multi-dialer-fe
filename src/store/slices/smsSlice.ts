import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export interface SMSTemplate {
    id: string;
    templateName: string;
    content: string;
    status: string;
    createdAt: string;
    updatedAt: string;
}

interface SMSState {
    templates: SMSTemplate[];
    isLoading: boolean;
    error: string | null;
}

const initialState: SMSState = {
    templates: [],
    isLoading: false,
    error: null,
};

// Fetch SMS templates
export const fetchSMSTemplates = createAsyncThunk(
    'sms/fetchTemplates',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/library/sms');
            if (response.data.success) {
                return response.data.data;
            }
            return rejectWithValue('Failed to fetch SMS templates');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error fetching SMS templates');
        }
    }
);

// Send SMS
export const sendSMSMessage = createAsyncThunk(
    'sms/sendSMS',
    async ({ to, message }: { to: string; message: string }, { rejectWithValue }) => {
        try {
            const response = await api.post('/calling/send-sms', { to, message });
            if (response.data.success) {
                return response.data;
            }
            return rejectWithValue('Failed to send SMS');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Error sending SMS');
        }
    }
);

export const smsSlice = createSlice({
    name: 'sms',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchSMSTemplates.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(fetchSMSTemplates.fulfilled, (state, action) => {
                state.isLoading = false;
                state.templates = action.payload;
            })
            .addCase(fetchSMSTemplates.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            .addCase(sendSMSMessage.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(sendSMSMessage.fulfilled, (state) => {
                state.isLoading = false;
            })
            .addCase(sendSMSMessage.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            });
    },
});

export default smsSlice.reducer;
