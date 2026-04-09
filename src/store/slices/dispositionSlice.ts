import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export type DispositionColor =
    | "red" | "orange" | "yellow" | "green" | "blue" | "purple" | "gray" | "pink"

export interface Disposition {
    id: string
    label: string
    value: string
    color: DispositionColor
    icon: string
    isSystem: boolean
    isActive: boolean
    order: number
}

interface DispositionState {
    dispositions: Disposition[];
    loading: boolean;
    error: string | null;
}

const initialState: DispositionState = {
    dispositions: [],
    loading: false,
    error: null,
};

// Async Thunks
export const fetchDispositions = createAsyncThunk(
    "dispositions/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/system-settings/dispositions");
            if (response.data.success) return response.data.data;
            return rejectWithValue(response.data.message || "Failed to fetch dispositions");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const createDisposition = createAsyncThunk(
    "dispositions/create",
    async (data: Partial<Disposition>, { rejectWithValue }) => {
        try {
            const response = await api.post("/system-settings/dispositions", data);
            if (response.data.success) return response.data.data;
            return rejectWithValue(response.data.message || "Failed to create disposition");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const updateDisposition = createAsyncThunk(
    "dispositions/update",
    async ({ id, data }: { id: string; data: Partial<Disposition> }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/system-settings/dispositions/${id}`, data);
            if (response.data.success) return response.data.data;
            return rejectWithValue(response.data.message || "Failed to update disposition");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const deleteDisposition = createAsyncThunk(
    "dispositions/delete",
    async (id: string, { rejectWithValue }) => {
        try {
            const response = await api.delete(`/system-settings/dispositions/${id}`);
            if (response.data.success) return id;
            return rejectWithValue(response.data.message || "Failed to delete disposition");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const reorderDispositions = createAsyncThunk(
    "dispositions/reorder",
    async (orderData: { id: string; order: number }[], { rejectWithValue }) => {
        try {
            const response = await api.put("/system-settings/dispositions/reorder", { orderData });
            if (response.data.success) return response.data.data;
            return rejectWithValue(response.data.message || "Failed to reorder dispositions");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const dispositionSlice = createSlice({
    name: "dispositions",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Fetch All
            .addCase(fetchDispositions.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchDispositions.fulfilled, (state, action) => {
                state.loading = false;
                state.dispositions = action.payload;
            })
            .addCase(fetchDispositions.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            // Create
            .addCase(createDisposition.fulfilled, (state, action) => {
                state.dispositions.push(action.payload);
            })
            // Update
            .addCase(updateDisposition.fulfilled, (state, action) => {
                const index = state.dispositions.findIndex(d => d.id === action.payload.id);
                if (index !== -1) state.dispositions[index] = action.payload;
            })
            // Delete
            .addCase(deleteDisposition.fulfilled, (state, action) => {
                state.dispositions = state.dispositions.filter(d => d.id !== action.payload);
            })
            // Reorder
            .addCase(reorderDispositions.fulfilled, (state, action) => {
                // If the backend returns all or updated, we can just replace or re-sort
                // For now, let's assume we need to re-fetch or the payload is enough
                state.dispositions = action.payload;
            });
    },
});

export default dispositionSlice.reducer;
