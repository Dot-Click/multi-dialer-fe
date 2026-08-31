import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export type A2PStatus = 'NOT_STARTED' | 'PENDING' | 'APPROVED' | 'REJECTED';

/**
 * Per-stage status shape emitted by the backend `/api/a2p/status` response.
 * Fields are nullable because a stage may not yet have a Twilio verdict
 * (row just written, poller hasn't run yet).
 */
export interface StageState {
    status: string | null;
    retriable: boolean | null;
    message: string | null;
    code: string | null;
    suggestedFields: string[];
}

export interface BrandStageState extends StageState {
    resubmitFeeUsd: number;
    resubmitCount: number;
}

export interface CampaignStageState extends StageState {
    resubmitCount: number;
}

/**
 * Shape of the prefill payload returned by `/api/a2p/details`. Everything
 * is a plain string, except the campaign array fields. Optional because
 * this may be null on first submission.
 */
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
    useCase: string | null;
    businessIndustry: string | null;
    messageSamples: string[];
    optInDetails: string | null;
    optInKeywords: string[];
    optOutKeywords: string[];
    helpKeywords: string[];
    helpMessage: string | null;
}

interface A2PState {
    // Rollup fields — kept for backwards compat with older callers that
    // read `state.a2p.status`. The panel reads `stages` directly.
    status: A2PStatus;
    rejectionReason: string | null;

    customerProfileApproved: boolean;
    stages: {
        customerProfile: StageState;
        brand: BrandStageState;
        campaign: CampaignStageState;
    };
    /**
     * True per-feature means the corresponding downstream card can proceed.
     * VI + CNAM attach to the Customer Profile, so both flip on the
     * moment the CP is approved — even if Brand or Campaign later fail.
     */
    unblocksDownstream: {
        voiceIntegrity: boolean;
        cnam: boolean;
    };

    // Previous submission's form fields, decrypted EIN included. Populated
    // by fetchA2PDetails so the modal can prefill on re-open. null when
    // the admin has never submitted.
    details: A2PDetails | null;

    loading: boolean;
    submitting: boolean;
    error: string | null;
}

const emptyStage: StageState = {
    status: null,
    retriable: null,
    message: null,
    code: null,
    suggestedFields: [],
};

const initialState: A2PState = {
    status: 'NOT_STARTED',
    rejectionReason: null,
    customerProfileApproved: false,
    stages: {
        customerProfile: emptyStage,
        brand: { ...emptyStage, resubmitFeeUsd: 0, resubmitCount: 0 },
        campaign: { ...emptyStage, resubmitCount: 0 },
    },
    unblocksDownstream: { voiceIntegrity: false, cnam: false },
    details: null,
    loading: false,
    submitting: false,
    error: null,
};

// -----------------------------------------------------------------------------
// Thunks
// -----------------------------------------------------------------------------

export const fetchA2PStatus = createAsyncThunk(
    'a2p/fetchStatus',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get('/a2p/status');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to fetch A2P status');
        }
    }
);

/**
 * Fetches the previously-submitted business + campaign details for
 * prefilling the onboarding wizard and the resubmit modals. Returns null
 * when the admin has never submitted A2P.
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

export const resubmitCustomerProfile = createAsyncThunk(
    'a2p/resubmitCP',
    async (details: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/a2p/resubmit/customer-profile', details);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to resubmit Business Profile');
        }
    }
);

export const resubmitBrand = createAsyncThunk(
    'a2p/resubmitBrand',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.post('/a2p/resubmit/brand');
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to resubmit Brand');
        }
    }
);

export const resubmitCampaign = createAsyncThunk(
    'a2p/resubmitCampaign',
    async (campaign: any, { rejectWithValue }) => {
        try {
            const response = await api.post('/a2p/resubmit/campaign', campaign);
            return response.data;
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || 'Failed to resubmit Campaign');
        }
    }
);

// -----------------------------------------------------------------------------
// Slice
// -----------------------------------------------------------------------------

const a2pSlice = createSlice({
    name: 'a2p',
    initialState,
    reducers: {
        resetA2PState: (state) => {
            state.status = 'NOT_STARTED';
            state.rejectionReason = null;
            state.error = null;
        },
        clearA2PError: (state) => {
            state.error = null;
        },
    },
    extraReducers: (builder) => {
        // fetchA2PStatus — writes the per-stage tree.
        builder.addCase(fetchA2PStatus.pending, (state) => {
            state.loading = true;
        });
        builder.addCase(fetchA2PStatus.fulfilled, (state, action) => {
            state.loading = false;
            const payload = action.payload;
            // The API keeps both `status` (legacy) and `overallStatus`.
            state.status = payload.overallStatus || payload.status || 'NOT_STARTED';
            state.rejectionReason = payload.rejectionReason || null;
            state.customerProfileApproved = !!payload.customerProfileApproved;

            const cp = payload.stages?.customerProfile ?? emptyStage;
            const brand = payload.stages?.brand ?? { ...emptyStage, resubmitFeeUsd: 0, resubmitCount: 0 };
            const campaign = payload.stages?.campaign ?? { ...emptyStage, resubmitCount: 0 };
            state.stages = {
                customerProfile: {
                    status: cp.status ?? null,
                    retriable: cp.retriable ?? null,
                    message: cp.message ?? null,
                    code: cp.code ?? null,
                    suggestedFields: cp.suggestedFields ?? [],
                },
                brand: {
                    status: brand.status ?? null,
                    retriable: brand.retriable ?? null,
                    message: brand.message ?? null,
                    code: brand.code ?? null,
                    suggestedFields: brand.suggestedFields ?? [],
                    resubmitFeeUsd: brand.resubmitFeeUsd ?? 0,
                    resubmitCount: brand.resubmitCount ?? 0,
                },
                campaign: {
                    status: campaign.status ?? null,
                    retriable: campaign.retriable ?? null,
                    message: campaign.message ?? null,
                    code: campaign.code ?? null,
                    suggestedFields: campaign.suggestedFields ?? [],
                    resubmitCount: campaign.resubmitCount ?? 0,
                },
            };
            state.unblocksDownstream = {
                voiceIntegrity: !!payload.unblocksDownstream?.voiceIntegrity,
                cnam: !!payload.unblocksDownstream?.cnam,
            };
        });
        builder.addCase(fetchA2PStatus.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // fetchA2PDetails — prefill data, with its own loading/error state.
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

        // Any of the four submit variants flips submitting + resets error.
        const submitStart = (state: A2PState) => {
            state.submitting = true;
            state.error = null;
        };
        const submitDone = (state: A2PState) => {
            state.submitting = false;
            state.status = 'PENDING';
        };
        const submitFail = (state: A2PState, action: any) => {
            state.submitting = false;
            state.error = action.payload as string;
        };

        builder.addCase(submitA2PRegistration.pending, submitStart);
        builder.addCase(submitA2PRegistration.fulfilled, submitDone);
        builder.addCase(submitA2PRegistration.rejected, submitFail);

        builder.addCase(resubmitCustomerProfile.pending, submitStart);
        builder.addCase(resubmitCustomerProfile.fulfilled, submitDone);
        builder.addCase(resubmitCustomerProfile.rejected, submitFail);

        builder.addCase(resubmitBrand.pending, submitStart);
        builder.addCase(resubmitBrand.fulfilled, submitDone);
        builder.addCase(resubmitBrand.rejected, submitFail);

        builder.addCase(resubmitCampaign.pending, submitStart);
        builder.addCase(resubmitCampaign.fulfilled, submitDone);
        builder.addCase(resubmitCampaign.rejected, submitFail);
    },
});

export const { resetA2PState, clearA2PError } = a2pSlice.actions;
export default a2pSlice.reducer;
