import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface CompanySetting {
  id?: string;
  companyName?: string;
  defaultTimeZone?: string;
  defaultCurrency?: string;
  dateTimeFormat?: string;
  notifyFailedPayment?: boolean;
  notifyUpcomingRenewal?: boolean;
  notifyMaintenanceNotice?: boolean;
  notifyCriticalError?: boolean;
  email?: string;
  newUserSignup?: boolean;
  loginAlerts?: boolean;
  // ... other fields from response
}

interface CompanySettingState {
  settings: CompanySetting | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanySettingState = {
  settings: null,
  loading: false,
  error: null,
};

export const createCompanySetting = createAsyncThunk(
  "companySetting/create",
  async (data: Partial<CompanySetting>, { rejectWithValue }) => {
    try {
      const response = await api.post("/company/create", data);
      if (response.data.success) {
        return response.data.data;
      } else {
        return rejectWithValue(response.data.message || "Failed to process company settings");
      }
    } catch (error: any) {
      if (error.response?.data) {
        return rejectWithValue(error.response.data.message || "Failed to process company settings");
      }
      return rejectWithValue(error.message);
    }
  }
);

export const companySettingSlice = createSlice({
  name: "companySetting",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createCompanySetting.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createCompanySetting.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(createCompanySetting.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default companySettingSlice.reducer;
