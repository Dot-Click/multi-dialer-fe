import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

/**
 * Mirrors the backend Voice Integrity statuses one-to-one. See:
 *   multi-dialer-be/src/services/voiceIntegrity.service.ts
 */
export type VoiceIntegrityStatus =
    | 'not-started'
    | 'draft'
    | 'pending-review'
    | 'twilio-approved'
    | 'twilio-rejected'
    // Admin has no Twilio subaccount — VI can't proceed. Frontend hides
    // the modal so we don't nag admins who need support to finish setup.
    | 'blocked-no-twilio'
    // Admin has a subaccount but no Business Profile yet (from A2P). VI
    // needs the profile to attach its trust product to. Modal is hidden;
    // the A2P flow drives profile creation first.
    | 'blocked-no-business-profile'
    // Admin's plan doesn't include VI. Modal is hidden entirely.
    | 'blocked-plan-not-eligible';

export interface VoiceIntegrityAttributes {
    useCase: string;
    businessEmployeeCount: number;
    averageBusinessDayCallVolume: number;
    notes?: string;
}

interface VoiceIntegrityState {
    status: VoiceIntegrityStatus;
    rejectionReason: string | null;
    loading: boolean;
    error: string | null;
    lastFetchedAt: number | null;
}

const initialState: VoiceIntegrityState = {
    status: 'not-started',
    rejectionReason: null,
    loading: false,
    error: null,
    lastFetchedAt: null,
};

export const fetchVoiceIntegrityStatus = createAsyncThunk(
    'voiceIntegrity/fetchStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/voice-integrity/status');
            return response.data; // { status, rejectionReason?, customerProfileSid?, trustProductSid?, endUserSid? }
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch Voice Integrity status');
        }
    }
);

export const submitVoiceIntegrityOnboarding = createAsyncThunk(
    'voiceIntegrity/submit',
    async (attrs: VoiceIntegrityAttributes, { rejectWithValue }) => {
        try {
            const response = await api.post('/voice-integrity/onboard', attrs);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to submit Voice Integrity registration');
        }
    }
);

/**
 * Explicit "poll Twilio now" — useful when the user reopens the modal in
 * pending-review state and wants to check whether approval has landed.
 */
export const refreshVoiceIntegrityStatus = createAsyncThunk(
    'voiceIntegrity/refresh',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/voice-integrity/refresh');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to refresh Voice Integrity status');
        }
    }
);

const voiceIntegritySlice = createSlice({
    name: 'voiceIntegrity',
    initialState,
    reducers: {
        clearVoiceIntegrityError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        const applyStatusPayload = (state: VoiceIntegrityState, action: any) => {
            state.status = action.payload?.status || 'not-started';
            state.rejectionReason = action.payload?.rejectionReason || null;
            state.lastFetchedAt = Date.now();
        };

        builder.addCase(fetchVoiceIntegrityStatus.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(fetchVoiceIntegrityStatus.fulfilled, (state, action) => {
            state.loading = false;
            applyStatusPayload(state, action);
        });
        builder.addCase(fetchVoiceIntegrityStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(submitVoiceIntegrityOnboarding.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(submitVoiceIntegrityOnboarding.fulfilled, (state, action) => {
            state.loading = false;
            applyStatusPayload(state, action);
        });
        builder.addCase(submitVoiceIntegrityOnboarding.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        builder.addCase(refreshVoiceIntegrityStatus.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(refreshVoiceIntegrityStatus.fulfilled, (state, action) => {
            state.loading = false;
            applyStatusPayload(state, action);
        });
        builder.addCase(refreshVoiceIntegrityStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { clearVoiceIntegrityError } = voiceIntegritySlice.actions;
export default voiceIntegritySlice.reducer;
