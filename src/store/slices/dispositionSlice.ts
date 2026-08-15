import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import api from "../../lib/axios";
import { setCurrentContactFields } from "./contactSlice";

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
    targetFolderId?: string | null
    // True for dispositions the caller owns/can manage: for an ADMIN/OWNER
    // that's every team disposition; for an AGENT, only their own personal
    // ones (team dispositions come back with isOwn: false, read-only).
    isOwn?: boolean
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
    async (data: Partial<Disposition> & { autoCreateFolder?: boolean }, { rejectWithValue }) => {
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

// An agent's personal reorder of the merged team+own Dispositions list — a
// per-agent overlay, doesn't touch the shared Disposition.order other
// viewers see. Use reorderLocal for the instant client-side reorder; this
// just persists it in the background.
export const setPersonalDispositionOrder = createAsyncThunk(
    "dispositions/setPersonalOrder",
    async (orderData: { id: string; order: number }[], { rejectWithValue }) => {
        try {
            const response = await api.put("/system-settings/dispositions/personal-order", { orderData });
            if (response.data.success) return response.data.data;
            return rejectWithValue(response.data.message || "Failed to save personal disposition order");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const applyDisposition = createAsyncThunk(
    "dispositions/apply",
    async ({ contactId, dispositionId, overrideFolderId, source }: { contactId: string, dispositionId: string, overrideFolderId?: string | null, source?: "CALL" | "MANUAL" }, { rejectWithValue, getState, dispatch }) => {
        try {
            const response = await api.post("/system-settings/dispositions/apply", { contactId, dispositionId, overrideFolderId, source });
            if (response.data.success) {
                const folderId: string | null = response.data.data?.folderId ?? null;

                // Sync the contact's folderIds in Redux so the detail view reflects the move immediately
                if (folderId) {
                    dispatch(setCurrentContactFields({ folderIds: [folderId] }));
                }

                // If the applied disposition is the default "Trash", also eliminate the
                // contact from the live dialing queue (backend in-memory queue) and the
                // current session queue — no further dials remain for it.
                const state = getState() as { dispositions: DispositionState };
                const applied = state.dispositions.dispositions.find(d => d.id === dispositionId);
                if (applied?.value?.toUpperCase() === "TRASH") {
                    // Remove from backend queue so the contact is never re-dialed,
                    // but do NOT update Redux queue state — that would shift queue[currentIndex]
                    // and auto-load the next contact, which the agent hasn't chosen to move to yet.
                    await api.post("/calling/queue/remove-contact", { contactId }).catch(() => { });
                }
                return response.data;
            }
            return rejectWithValue(response.data.message || "Failed to apply disposition");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

// Currently-applied "tag" dispositions for a contact — independent of the
// single folder-moving applyDisposition flow above. Lets a contact carry
// more than one non-exclusive disposition at once (e.g. "Hot Lead" + "Follow
// Up"), unlike Contact.disposition (a scalar).
export const fetchContactDispositions = createAsyncThunk(
    "dispositions/fetchForContact",
    async (contactId: string, { rejectWithValue }) => {
        try {
            const response = await api.get(`/system-settings/dispositions/contact/${contactId}`);
            if (response.data.success) return response.data.data.dispositionIds as string[];
            return rejectWithValue(response.data.message || "Failed to fetch contact dispositions");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

export const setContactDispositions = createAsyncThunk(
    "dispositions/setForContact",
    async ({ contactId, dispositionIds }: { contactId: string; dispositionIds: string[] }, { rejectWithValue }) => {
        try {
            const response = await api.put(`/system-settings/dispositions/contact/${contactId}`, { dispositionIds });
            if (response.data.success) return response.data.data.dispositionIds as string[];
            return rejectWithValue(response.data.message || "Failed to update contact dispositions");
        } catch (error: any) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const dispositionSlice = createSlice({
    name: "dispositions",
    initialState,
    reducers: {
        // Optimistically applies a new order client-side so the list re-sorts
        // instantly on drop, instead of waiting on the reorderDispositions
        // round-trip (which would otherwise cause a visible jump/flicker).
        reorderLocal(state, action: PayloadAction<{ id: string; order: number }[]>) {
            action.payload.forEach(({ id, order }) => {
                const item = state.dispositions.find(d => d.id === id);
                if (item) item.order = order;
            });
        },
    },
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
            // Reorder — the backend only returns the subset of dispositions whose
            // order changed (e.g. just the "custom" section), so merge by id
            // instead of replacing the whole array (that would drop every
            // disposition from the other section out of the store).
            .addCase(reorderDispositions.fulfilled, (state, action) => {
                const updated = action.payload as Disposition[];
                updated.forEach((u) => {
                    const index = state.dispositions.findIndex(d => d.id === u.id);
                    if (index !== -1) state.dispositions[index] = u;
                });
            });
    },
});

export const { reorderLocal } = dispositionSlice.actions;
export default dispositionSlice.reducer;
