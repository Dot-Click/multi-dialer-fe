// import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
// import api from "../../lib/axios";

// export interface AppearanceSettings {
//   id?: string;
//   _id?: string;
//   workspace: {
//     calendar: boolean;
//     hotlist: boolean;
//     callingGroups: boolean;
//     dialerHealth: boolean;
//     callStatistics: boolean;
//     foldersLists: boolean;
//     recentActivity: boolean;
//   };
//   aiSidekick: {
//     bestTimeToCall: boolean;
//     leadIntelligence: boolean;
//     aiCoachingCallAnalysis: boolean;
//     callOutcomeIntelligence: boolean;
//     efficiencyAutomation: boolean;
//     complianceRiskMonitoring: boolean;
//     callingGroups: boolean;
//     agentImprovementScores: boolean;
//     pipelineAccelerationIndex: boolean;
//   };
//   lockGroups: boolean;
//   birthdays: boolean;
//   homeCloseDate: boolean;
//   timeZone: string;
// }

// interface AppearanceState {
//   settings: AppearanceSettings | null;
//   loading: boolean;
//   error: string | null;
// }

// const initialState: AppearanceState = {
//   settings: null,
//   loading: false,
//   error: null,
// };

// export const createAppearance = createAsyncThunk(
//   "appearance/create",
//   async (data: AppearanceSettings, { rejectWithValue }) => {
//     try {
//       const response = await api.post(
//         "/system-settings/appearance/create",
//         data,
//       );
//       if (response.data.success) {
//         return response.data.data;
//       } else {
//         return rejectWithValue(
//           response.data.message || "Failed to create appearance settings",
//         );
//       }
//     } catch (error: any) {
//       if (error.response && error.response.data) {
//         return rejectWithValue(
//           error.response.data.message || "Failed to create appearance settings",
//         );
//       } else {
//         return rejectWithValue(error.message);
//       }
//     }
//   },
// );

// export const getAppearance = createAsyncThunk(
//   "appearance/get",
//   async (_, { rejectWithValue }) => {
//     try {
//       const response = await api.get("/system-settings/appearance");
//       if (response.data.success) {
//         return response.data.data;
//       } else {
//         return rejectWithValue(
//           response.data.message || "Failed to fetch appearance settings",
//         );
//       }
//     } catch (error: any) {
//       if (error.response && error.response.data) {
//         return rejectWithValue(
//           error.response.data.message || "Failed to fetch appearance settings",
//         );
//       } else {
//         return rejectWithValue(error.message);
//       }
//     }
//   },
// );

// export const updateAppearance = createAsyncThunk(
//   "appearance/update",
//   async (
//     { id, data }: { id: string; data: Partial<AppearanceSettings> },
//     { rejectWithValue },
//   ) => {
//     try {
//       const response = await api.put(`/system-settings/appearance/${id}`, data);
//       if (response.data.success) {
//         return response.data.data;
//       } else {
//         return rejectWithValue(
//           response.data.message || "Failed to update appearance settings",
//         );
//       }
//     } catch (error: any) {
//       if (error.response && error.response.data) {
//         return rejectWithValue(
//           error.response.data.message || "Failed to update appearance settings",
//         );
//       } else {
//         return rejectWithValue(error.message);
//       }
//     }
//   },
// );

// export const deleteAppearance = createAsyncThunk(
//   "appearance/delete",
//   async (id: string, { rejectWithValue }) => {
//     try {
//       const response = await api.delete(`/system-settings/appearance/${id}`);
//       if (response.data.success) {
//         return id; // Return the deleted ID
//       } else {
//         return rejectWithValue(
//           response.data.message || "Failed to delete appearance settings",
//         );
//       }
//     } catch (error: any) {
//       if (error.response && error.response.data) {
//         return rejectWithValue(
//           error.response.data.message || "Failed to delete appearance settings",
//         );
//       } else {
//         return rejectWithValue(error.message);
//       }
//     }
//   },
// );

// export const appearanceSlice = createSlice({
//   name: "appearance",
//   initialState,
//   reducers: {},
//   extraReducers: (builder) => {
//     builder
//       // createAppearance
//       .addCase(createAppearance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(createAppearance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.settings = action.payload;
//       })
//       .addCase(createAppearance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // getAppearance
//       .addCase(getAppearance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(getAppearance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.settings = action.payload;
//       })
//       .addCase(getAppearance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // updateAppearance
//       .addCase(updateAppearance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(updateAppearance.fulfilled, (state, action) => {
//         state.loading = false;
//         state.settings = action.payload;
//       })
//       .addCase(updateAppearance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       })
//       // deleteAppearance
//       .addCase(deleteAppearance.pending, (state) => {
//         state.loading = true;
//         state.error = null;
//       })
//       .addCase(deleteAppearance.fulfilled, (state) => {
//         state.loading = false;
//         state.settings = null;
//       })
//       .addCase(deleteAppearance.rejected, (state, action) => {
//         state.loading = false;
//         state.error = action.payload as string;
//       });
//   },
// });

// export default appearanceSlice.reducer;




import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

// --------------------
// Type Definitions (Flat)
// --------------------
export interface AppearanceSettings {
  id?: string;
  _id?: string;

  // Workspace
  calendar: boolean;
  hotlist: boolean;
  callingGroupsWorkspace: boolean;
  dialerHealth: boolean;
  callStatistics: boolean;
  foldersLists: boolean;
  recentActivity: boolean;

  // AI Sidekick
  bestTimeToCall: boolean;
  leadIntelligence: boolean;
  aiCoachingCallAnalysis: boolean;
  callOutcomeIntelligence: boolean;
  efficiencyAutomation: boolean;
  complianceRiskMonitoring: boolean;
  callingGroupsAiSidekick: boolean;
  agentImprovementScores: boolean;
  pipelineAccelerationIndex: boolean;

  // Other
  lockGroups: boolean;
  birthdays: boolean;
  homeCloseDate: boolean;
  timeZone: string;
}

interface AppearanceState {
  settings: AppearanceSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: AppearanceState = {
  settings: null,
  loading: false,
  error: null,
};

// --------------------
// Async Thunks
// --------------------

// Create or update appearance
export const createAppearance = createAsyncThunk(
  "appearance/create",
  async (data: AppearanceSettings, { rejectWithValue }) => {
    try {
      const response = await api.post("/system-settings/appearance/create", data);
      if (response.data.success) return response.data.data;
      return rejectWithValue(response.data.message || "Failed to create appearance settings");
    } catch (error: any) {
      if (error.response?.data) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

// Get appearance
export const getAppearance = createAsyncThunk(
  "appearance/get",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/system-settings/appearance");
      console.log(response)
      if (response.data.success){
         return response.data.data
      };
      return rejectWithValue(response.data.message || "Failed to fetch appearance settings");
    } catch (error: any) {
      if (error.response?.data) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

// Update appearance by ID
export const updateAppearance = createAsyncThunk(
  "appearance/update",
  async (
    { id, data }: { id: string; data: Partial<AppearanceSettings> },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/system-settings/appearance/${id}`, data);
      if (response.data.success) return response.data.data;
      return rejectWithValue(response.data.message || "Failed to update appearance settings");
    } catch (error: any) {
      if (error.response?.data) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

// Delete appearance by ID
export const deleteAppearance = createAsyncThunk(
  "appearance/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/system-settings/appearance/${id}`);
      if (response.data.success) return id;
      return rejectWithValue(response.data.message || "Failed to delete appearance settings");
    } catch (error: any) {
      if (error.response?.data) return rejectWithValue(error.response.data.message);
      return rejectWithValue(error.message);
    }
  }
);

// --------------------
// Slice
// --------------------
export const appearanceSlice = createSlice({
  name: "appearance",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Create
      .addCase(createAppearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createAppearance.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(createAppearance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Get
      .addCase(getAppearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppearance.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(getAppearance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Update
      .addCase(updateAppearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateAppearance.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = action.payload;
      })
      .addCase(updateAppearance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteAppearance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAppearance.fulfilled, (state) => {
        state.loading = false;
        state.settings = null;
      })
      .addCase(deleteAppearance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default appearanceSlice.reducer;