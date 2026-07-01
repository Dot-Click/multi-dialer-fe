import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface CallerIdRecord {
  id: string;
  label: string;
  countryCode: string;
  numberOfLines: number;
  twillioNumber: string | null;
  twillioSid: string | null;
  dialerType: string | null;
  aiPacing: boolean | null;
  callCount: number;
  frozenAt: string | null;
  unfreezeAt: string | null;
  reputationStatus: string | null;
  reputationScore: number | null;
  createdAt: string;
  updatedAt: string;
}

interface SuperAdminCallerIdState {
  callerIds: CallerIdRecord[];
  selectedUserId: string | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: SuperAdminCallerIdState = {
  callerIds: [],
  selectedUserId: null,
  loading: false,
  saving: false,
  error: null,
};

export const fetchCallerIdsByUser = createAsyncThunk(
  "superAdminCallerIds/fetch",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/super-admin/caller-ids?userId=${userId}&_t=${Date.now()}`);
      if (res.data.success) return { userId, callerIds: res.data.data as CallerIdRecord[] };
      return rejectWithValue(res.data.message || "Failed to fetch caller IDs");
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const updateAdminCallerId = createAsyncThunk(
  "superAdminCallerIds/update",
  async (
    payload: {
      id: string;
      label?: string;
      countryCode?: string;
      twillioNumber?: string;
      twillioSid?: string;
      numberOfLines?: number;
      dialerType?: string;
      aiPacing?: boolean;
    },
    { rejectWithValue }
  ) => {
    try {
      const { id, ...body } = payload;
      const res = await api.put(`/super-admin/caller-ids/${id}`, body);
      if (res.data.success) return res.data.data as CallerIdRecord;
      return rejectWithValue(res.data.message || "Failed to update caller ID");
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

export const deleteAdminCallerId = createAsyncThunk(
  "superAdminCallerIds/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/super-admin/caller-ids/${id}`);
      if (res.data.success) return id;
      return rejectWithValue(res.data.message || "Failed to delete caller ID");
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const superAdminCallerIdSlice = createSlice({
  name: "superAdminCallerIds",
  initialState,
  reducers: {
    setSelectedUserId(state, action) {
      state.selectedUserId = action.payload;
      state.callerIds = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCallerIdsByUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCallerIdsByUser.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedUserId = action.payload.userId;
        state.callerIds = action.payload.callerIds;
      })
      .addCase(fetchCallerIdsByUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateAdminCallerId.pending, (state) => { state.saving = true; })
      .addCase(updateAdminCallerId.fulfilled, (state, action) => {
        state.saving = false;
        const idx = state.callerIds.findIndex((c) => c.id === action.payload.id);
        if (idx >= 0) state.callerIds[idx] = action.payload;
      })
      .addCase(updateAdminCallerId.rejected, (state) => { state.saving = false; })
      .addCase(deleteAdminCallerId.fulfilled, (state, action) => {
        state.callerIds = state.callerIds.filter((c) => c.id !== action.payload);
      });
  },
});

export const { setSelectedUserId } = superAdminCallerIdSlice.actions;
export default superAdminCallerIdSlice.reducer;
