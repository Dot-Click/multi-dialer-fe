import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

interface ContactAnalysisData {
  hasData: boolean;
  sentiment: { positive: number; neutral: number; negative: number };
  confidence: number;
  totalCalls: number;
  latestDisposition: string | null;
  latestSentiment: string | null;
  latestSummary: string | null;
}

interface ContactAnalysisState {
  data: ContactAnalysisData | null;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: ContactAnalysisState = {
  data: null,
  status: 'idle',
  error: null,
};

export const fetchContactAnalysis = createAsyncThunk(
  'contactAnalysis/fetch',
  async (contactId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/calling/contact-analysis/${contactId}`);
      return response.data.data as ContactAnalysisData;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch contact analysis');
    }
  }
);

const contactAnalysisSlice = createSlice({
  name: 'contactAnalysis',
  initialState,
  reducers: {
    resetContactAnalysis: (state) => {
      state.data = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchContactAnalysis.pending, (state) => {
        state.status = 'loading';
        state.error = null;
      })
      .addCase(fetchContactAnalysis.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.data = action.payload;
      })
      .addCase(fetchContactAnalysis.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export const { resetContactAnalysis } = contactAnalysisSlice.actions;
export default contactAnalysisSlice.reducer;
