import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export interface PlanLimitRow {
    id: string;
    planKey: string;
    displayName: string | null;
    maxDialerLines: number | null;
    includedAgentSeats: number | null;
    maxAgentSeats: number | null;
    includedNumbers: number | null;
    extraNumberPriceCents: number | null;
    callRecordingEnabled: boolean;
    aiInsightsLevel: 'NONE' | 'BASIC' | 'FULL';
    stirShakenEnabled: boolean;
    smartNumberRotationEnabled: boolean;
    teamDashboardEnabled: boolean;
    priorityRoutingEnabled: boolean;
    aiCallCoachingEnabled: boolean;
    advancedDeliverabilityEnabled: boolean;
}

export type PlanLimitInput = Omit<PlanLimitRow, 'id' | 'planKey'> & { planName: string };

interface PlanLimitsState {
    rows: PlanLimitRow[];
    loading: boolean;
    saving: boolean;
    error: string | null;
}

const initialState: PlanLimitsState = {
    rows: [],
    loading: false,
    saving: false,
    error: null,
};

export const fetchAllPlanLimits = createAsyncThunk(
    'planLimits/fetchAll',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/plan-limits');
            if (response.data.success) {
                return response.data.data as PlanLimitRow[];
            }
            return rejectWithValue(response.data.message || 'Failed to fetch plan limits');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const savePlanLimits = createAsyncThunk(
    'planLimits/save',
    async (input: PlanLimitInput, { rejectWithValue }) => {
        try {
            const { planName, ...body } = input;
            const response = await api.put(`/plan-limits/${encodeURIComponent(planName)}`, body);
            if (response.data.success) {
                return response.data.data as PlanLimitRow;
            }
            return rejectWithValue(response.data.message || 'Failed to save plan limits');
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const planLimitsSlice = createSlice({
    name: 'planLimits',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchAllPlanLimits.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchAllPlanLimits.fulfilled, (state, action) => {
                state.loading = false;
                state.rows = action.payload;
            })
            .addCase(fetchAllPlanLimits.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(savePlanLimits.pending, (state) => {
                state.saving = true;
                state.error = null;
            })
            .addCase(savePlanLimits.fulfilled, (state, action) => {
                state.saving = false;
                const index = state.rows.findIndex((r) => r.planKey === action.payload.planKey);
                if (index >= 0) {
                    state.rows[index] = action.payload;
                } else {
                    state.rows.push(action.payload);
                }
            })
            .addCase(savePlanLimits.rejected, (state, action) => {
                state.saving = false;
                state.error = action.payload as string;
            });
    },
});

export default planLimitsSlice.reducer;
