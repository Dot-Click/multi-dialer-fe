import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface Contact {
  id: string;
  fullName?: string;
  name?: string;
  lastDialedDate?: string;
  phone?: string;
  email?: string;
  list?: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  address2?: string;
  mailingAddress?: string;
  mailingAddress2?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingZip?: string;
  source?: string;
  tags?: any;
  phones?: { number: string; type: string; isPrimary?: boolean }[];
  emails?: { email: string; isPrimary: boolean }[];
  miscValues?: any;
  leadsheetValues?: any;
  notes: string[];
  folderId?: string | null;
  permission?: boolean;
  want?: boolean;
  why?: boolean;
  statusQuo?: boolean;
  timeline?: boolean;
  agent?: boolean;
}

interface ContactState {
  contacts: Contact[];
  importHistory: any[];
  exportHistory: any[];
  backupHistory: any[];
  currentContact: any | null;
  queue: any[];
  folders: ContactFolder[];
  lists: ContactList[];
  groups: ContactGroup[];
  isLoading: boolean;
  error: string | null;
  duplicateContacts: Contact[];
}

export interface ContactList {
  id: string;
  name: string;
  contactIds: string[];
  agentIds: string[];
  folderId?: string | null;
  createdAt: string;
}

export interface ContactFolder {
  id: string;
  name: string;
  listIds: string[];
  parentId?: string | null;
  createdAt: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  contactIds: string[];
  createdAt: string;
}

const initialState: ContactState = {
  contacts: [],
  importHistory: [],
  exportHistory: [],
  backupHistory: [],
  currentContact: null,
  queue: [],
  folders: [],
  lists: [],
  groups: [],
  isLoading: false,
  error: null,
  duplicateContacts: [],
};

export interface CreateContactEmail {
  email: string;
  isPrimary: boolean;
}

interface ExportContactPayload {
  fieldNames: string[]; // selected fields
  listId?: string | null; // optional
  groupId?: string | null; // optional
}

export interface CreateContactPhone {
  number: string;
  type: "MOBILE" | "TELEPHONE" | "HOME" | "WORK";
}

export interface CreateContactPayload {
  fullName: string;
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
  mailingAddress?: string;
  mailingCity?: string;
  mailingState?: string;
  mailingZip?: string;
  source?: string;
  tags?: string[];
  dataDialerId?: string;
  emails: CreateContactEmail[];
  phones: CreateContactPhone[];
  contactListId?: string;
  miscValues?: any;
  leadsheetValues?: any;
  permission?: boolean;
  want?: boolean;
  why?: boolean;
  statusQuo?: boolean;
  timeline?: boolean;
  agent?: boolean;
}

// ---------------------------------------------------------------------------
// THUNKS
// ---------------------------------------------------------------------------

export const fetchContacts = createAsyncThunk(
  "contacts/fetchContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact");
      if (response.data.success) {
        return response.data.data.map((c: any) => ({
          id: c.id,
          name: c.fullName || "-",
          lastDialedDate: "-",
          phone: c.phones?.[0]?.number || "-",
          email: c.emails?.[0]?.email || "-",
          list: c.source || "-",
          tags: c.tags?.length > 0 ? c.tags.join(", ") : "-",
          miscValues: c.miscValues || {},
          leadsheetValues: c.leadsheetValues || {},
          notes: c.notes || [],
        }));
      }
      return rejectWithValue("Failed to fetch contacts");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching contacts",
      );
    }
  },
);

export const fetchContactsByList = createAsyncThunk(
  "contacts/fetchContactsByList",
  async (listId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contact/contacts-list/${listId}`);
      if (response.data.success) {
        return response.data.data.map((c: any) => ({
          id: c.id,
          name: c.fullName || "-",
          lastDialedDate: "-",
          phone: c.phones?.[0]?.number || "-",
          email: c.emails?.[0]?.email || "-",
          list: c.source || "-",
          tags: c.tags?.length > 0 ? c.tags.join(", ") : "-",
          miscValues: c.miscValues || {},
          leadsheetValues: c.leadsheetValues || {},
          notes: c.notes || [],
          folderId: c.folderId || null,
        }));
      }
      return rejectWithValue("Failed to fetch contacts for this list");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error fetching contacts for this list",
      );
    }
  },
);

export const fetchContactsByFolder = createAsyncThunk(
  "contacts/fetchContactsByFolder",
  async (folderId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contact/contacts-folder/${folderId}`);
      if (response.data.success) {
        return response.data.data.map((c: any) => ({
          id: c.id,
          name: c.fullName || "-",
          lastDialedDate: "-",
          phone: c.phones?.[0]?.number || "-",
          email: c.emails?.[0]?.email || "-",
          list: c.source || "-",
          tags: c.tags?.length > 0 ? c.tags.join(", ") : "-",
          miscValues: c.miscValues || {},
          leadsheetValues: c.leadsheetValues || {},
          notes: c.notes || [],
          folderId: c.folderId || null,
        }));
      }
      return rejectWithValue("Failed to fetch contacts for this folder");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Error fetching contacts for this folder",
      );
    }
  },
);

export const fetchContactById = createAsyncThunk(
  "contacts/fetchContactById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contact/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch contact details");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching contact details",
      );
    }
  },
);

export const createContact = createAsyncThunk(
  "contacts/createContact",
  async (payload: CreateContactPayload, { rejectWithValue }) => {
    try {
      const response = await api.post("/contact/create", payload);
      if (response.data.success) {
        // Backend handles adding contact to the list inside the transaction
        // Do NOT call PATCH /list/:id here — that would wipe contactIds
        return response.data.data;
      }
      return rejectWithValue("Failed to create contact");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating contact",
      );
    }
  },
);

export const getAllImportedContacts = createAsyncThunk(
  "contacts/getAllImportedContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact/import-contacts");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch import history");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching import history",
      );
    }
  },
);

export const updateContact = createAsyncThunk(
  "contacts/updateContact",
  async (
    { id, payload }: { id: string; payload: any },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put(`/contact/${id}`, payload);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to update contact");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating contact",
      );
    }
  },
);

export const deleteContact = createAsyncThunk(
  "contacts/deleteContact",
  async (
    { id, folderId, listId, hardDelete = false }: { id: string; folderId?: string; listId?: string; hardDelete?: boolean },
    { rejectWithValue }
  ) => {
    try {
      let url = `/contact/${id}?hardDelete=${hardDelete}`;
      if (folderId) url += `&folderId=${folderId}`;
      if (listId) url += `&listId=${listId}`;

      const response = await api.delete(url);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue("Failed to delete contact");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting contact",
      );
    }
  },
);

export const bulkDeleteContacts = createAsyncThunk(
  "contacts/bulkDeleteContacts",
  async (
    { contactIds, folderId, listId, hardDelete = false }: { contactIds: string[]; folderId?: string; listId?: string; hardDelete?: boolean },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/contact/bulk-delete", {
        contactIds,
        folderId,
        listId,
        hardDelete
      });
      if (response.data.success) {
        return contactIds;
      }
      return rejectWithValue("Failed to perform bulk deletion");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error during bulk deletion",
      );
    }
  }
);

export const mergeContacts = createAsyncThunk(
  "contacts/mergeContacts",
  async (
    { masterId, duplicateIds, targetFolderId, targetListId }: { masterId: string; duplicateIds: string[]; targetFolderId: string; targetListId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post("/contact/merge", {
        masterId,
        duplicateIds,
        targetFolderId,
        targetListId,
      });
      if (response.data.success) {
        return {
          mergedContact: response.data.data,
          duplicateIds,
        };
      }
      return rejectWithValue("Failed to merge contacts");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error merging contacts",
      );
    }
  }
);

export const restoreContact = createAsyncThunk(
  "contacts/restoreContact",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/contact/${id}?restore=true`);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue("Failed to restore contact");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error restoring contact",
      );
    }
  },
);

// Assigns a contact to a list (moves the contact, updates source field)
export const assignContactToList = createAsyncThunk(
  "contacts/assignContactToList",
  async (
    { contactId, listId }: { contactId: string; listId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/contact/${contactId}/assign`, {
        listId,
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to assign contact to list");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error assigning contact to list",
      );
    }
  },
);

// Assigns agents (user IDs) to a list — admin only, separate from contact assignment
export const assignAgentsToList = createAsyncThunk(
  "contacts/assignAgentsToList",
  async (
    { listId, agentIds }: { listId: string; agentIds: string[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/contact/list/${listId}/agents`, {
        agentIds,
      });
      if (response.data.success) {
        return { listId, agentIds, data: response.data.data };
      }
      return rejectWithValue("Failed to assign agents");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error assigning agents",
      );
    }
  },
);

export const assignContactToGroups = createAsyncThunk(
  "contacts/assignContactToGroups",
  async (
    { contactId, groupIds }: { contactId: string; groupIds: string[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/contact/${contactId}/groups`, {
        groupIds,
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to assign contact to groups");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error assigning contact to groups",
      );
    }
  },
);

export const fetchContactFolders = createAsyncThunk(
  "contacts/fetchContactFolders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact/folder");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch contact folders");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching contact folders",
      );
    }
  },
);

export const createContactFolder = createAsyncThunk(
  "contacts/createContactFolder",
  async (
    payload: { name: string; listIds?: string[]; parentId?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/contact/folder", payload);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to create folder");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating folder",
      );
    }
  },
);

export const updateContactFolder = createAsyncThunk(
  "contacts/updateContactFolder",
  async (
    { id, payload }: { id: string; payload: { name?: string; listIds?: string[]; parentId?: string | null } },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/contact/folder/${id}`, payload);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to update folder");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating folder",
      );
    }
  },
);

export const deleteContactFolder = createAsyncThunk(
  "contacts/deleteContactFolder",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/contact/folder/${id}`);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue("Failed to delete folder");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting folder",
      );
    }
  },
);

export const fetchContactLists = createAsyncThunk(
  "contacts/fetchContactLists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact/list");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch contact lists");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching contact lists",
      );
    }
  },
);

export const createContactList = createAsyncThunk(
  "contacts/createContactList",
  async (
    payload: { name: string; contactIds?: string[]; folderId?: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post("/contact/list", payload);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to create list");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error creating list",
      );
    }
  },
);

export const updateContactList = createAsyncThunk(
  "contacts/updateContactList",
  async (
    { id, payload }: { id: string; payload: { name?: string; contactIds?: string[]; folderId?: string | null } },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/contact/list/${id}`, payload);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to update list");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error updating list",
      );
    }
  },
);

export const deleteContactList = createAsyncThunk(
  "contacts/deleteContactList",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/contact/list/${id}`);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue("Failed to delete list");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting list",
      );
    }
  },
);

export const fetchContactGroups = createAsyncThunk(
  "contacts/fetchContactGroups",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact/group");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch contact groups");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching contact groups",
      );
    }
  },
);

export const sendLeadSheetEmail = createAsyncThunk(
  "contacts/sendLeadSheetEmail",
  async (
    {
      contactId,
      leadSheetId,
      recipientEmail,
    }: { contactId: string; leadSheetId: string; recipientEmail: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(
        `/contact/${contactId}/leadsheet/send-email`,
        {
          leadSheetId,
          recipientEmail,
        },
      );
      if (response.data.success) {
        return response.data;
      }
      return rejectWithValue("Failed to send lead sheet email");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error sending lead sheet email",
      );
    }
  },
);

export const exportContactCSV = createAsyncThunk(
  "contacts/exportContactCSV",
  async (
    { fieldNames, listId, groupId }: ExportContactPayload,
    { rejectWithValue },
  ) => {
    try {
      const payload = {
        fieldNames,
        listId: listId ?? null,
        groupId: groupId ?? null,
      };

      const response = await api.post(`/contact/export-csv`, payload);

      if (response.data.success) {
        // backend sirf contactsCount ya metadata return karega
        return response.data.data;
      }

      return rejectWithValue("Failed to export contact to csv");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error exporting contact to csv",
      );
    }
  },
);

export const getAllExportContacts = createAsyncThunk(
  "contacts/getAllExportContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact/export-csv");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch export history");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching export history",
      );
    }
  },
);

export const bulkAssignContactsToList = createAsyncThunk(
  "contacts/bulkAssignContactsToList",
  async (
    { contactIds, listId }: { contactIds: string[]; listId: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post(`/contact/bulk-assign-list`, {
        contactIds,
        listId,
      });
      if (response.data.success) {
        return { contactIds, listId, listName: response.data.listName };
      }
      return rejectWithValue("Failed to assign contacts to list");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error assigning contacts to list",
      );
    }
  },
);

export const bulkAssignContactsToFolder = createAsyncThunk(
  "contacts/bulkAssignContactsToFolder",
  async (
    { contactIds, folderId }: { contactIds: string[]; folderId: string | null },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/contact/bulk-assign-folder`, {
        contactIds,
        folderId,
      });
      if (response.data.success) {
        return { contactIds, folderId };
      }
      return rejectWithValue("Failed to assign contacts to folder");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error assigning contacts to folder",
      );
    }
  },
);

export const bulkMoveToDnc = createAsyncThunk(
  "contacts/bulkMoveToDnc",
  async (contactIds: string[], { rejectWithValue }) => {
    try {
      const response = await api.post(`/contact/bulk-move-to-dnc`, {
        contactIds,
      });
      if (response.data.success) {
        return contactIds;
      }
      return rejectWithValue("Failed to move contacts to DNC");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error moving contacts to DNC",
      );
    }
  },
);

export const moveFolder = createAsyncThunk(
  "contacts/moveFolder",
  async (
    { id, parentId }: { id: string; parentId: string | null },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/contact/folder/${id}`, { parentId });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to move folder");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error moving folder",
      );
    }
  },
);

export const moveList = createAsyncThunk(
  "contacts/moveList",
  async (
    { id, folderId }: { id: string; folderId: string | null },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch(`/contact/list/${id}`, { folderId });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to move list");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error moving list",
      );
    }
  },
);

export const uploadAttachment = createAsyncThunk(
  "contacts/uploadAttachment",
  async (
    { contactId, file }: { contactId: string; file: File },
    { rejectWithValue },
  ) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await api.post(
        `/contact/${contactId}/attachment`,
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        },
      );
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to upload attachment");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error uploading attachment",
      );
    }
  },
);

export const deleteAttachment = createAsyncThunk(
  "contacts/deleteAttachment",
  async (attachmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/contact/attachment/${attachmentId}`);
      if (response.data.success) {
        return attachmentId;
      }
      return rejectWithValue("Failed to delete attachment");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error deleting attachment",
      );
    }
  },
);

export const getAllBackupContacts = createAsyncThunk(
  "contacts/getAllBackupContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact/backup-contacts");
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to fetch backup contacts");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching backup contacts",
      );
    }
  },
);

export const addContactNote = createAsyncThunk(
  "contacts/addContactNote",
  async ({ id, note }: { id: string; note: string }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/contact/${id}/note`, { note });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue("Failed to add note");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error adding note",
      );
    }
  },
);

export const fetchDuplicateContacts = createAsyncThunk(
  "contacts/fetchDuplicateContacts",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/contact/duplicates");
      if (response.data.success) {
        return response.data.data.map((c: any) => ({
          id: c.id,
          name: c.fullName || "-",
          lastDialedDate: "-",
          phone: c.phones?.[0]?.number || "-",
          email: c.emails?.[0]?.email || "-",
          list: c.source || "-",
          tags: c.tags?.length > 0 ? c.tags.join(", ") : "-",
          miscValues: c.miscValues || {},
          leadsheetValues: c.leadsheetValues || {},
          notes: c.notes || [],
        }));
      }
      return rejectWithValue("Failed to fetch duplicate contacts");
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Error fetching duplicate contacts",
      );
    }
  },
);

// ---------------------------------------------------------------------------
// SLICE
// ---------------------------------------------------------------------------

export const contactSlice = createSlice({
  name: "contacts",
  initialState,
  reducers: {
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    removeFromQueue: (state, action) => {
      state.queue = state.queue.filter((c: any) => c.id !== action.payload);
    },
    setCurrentContact: (state, action) => {
      state.currentContact = action.payload;
    },
    setCurrentContactFields: (state, action) => {
      if (state.currentContact) {
        state.currentContact = { ...state.currentContact, ...action.payload };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      // ── fetchContacts ──────────────────────────────────────────────────────
      .addCase(fetchContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── fetchContactsByList ────────────────────────────────────────────────
      .addCase(fetchContactsByList.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContactsByList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContactsByList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── fetchContactsByFolder ────────────────────────────────────────────────
      .addCase(fetchContactsByFolder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchContactsByFolder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.contacts = action.payload;
      })
      .addCase(fetchContactsByFolder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── fetchContactById ───────────────────────────────────────────────────
      .addCase(fetchContactById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        state.currentContact = null;
      })
      .addCase(fetchContactById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentContact = action.payload;
      })
      .addCase(fetchContactById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── createContact ──────────────────────────────────────────────────────
      .addCase(createContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.isLoading = false;
        const newContact: Contact = {
          id: action.payload.id,
          name: action.payload.fullName || "-",
          lastDialedDate: "-",
          phone: action.payload.phones?.[0]?.number || "-",
          email: action.payload.emails?.[0]?.email || "-",
          list: action.payload.source || "-",
          tags:
            action.payload.tags?.length > 0
              ? action.payload.tags.join(", ")
              : "-",
          notes: action.payload.notes || [],
        };
        state.contacts.unshift(newContact);
      })
      .addCase(createContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── updateContact ──────────────────────────────────────────────────────
      .addCase(updateContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentContact = action.payload;
        const index = state.contacts.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.contacts[index] = {
            id: action.payload.id,
            name: action.payload.fullName || "-",
            lastDialedDate: "-",
            phone: action.payload.phones?.[0]?.number || "-",
            email: action.payload.emails?.[0]?.email || "-",
            list: action.payload.source || "-",
            tags:
              action.payload.tags?.length > 0
                ? action.payload.tags.join(", ")
                : "-",
            notes: action.payload.notes || [],
          };
        }
      })
      .addCase(updateContact.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── deleteContact ──────────────────────────────────────────────────────
      .addCase(deleteContact.fulfilled, (state, action) => {
        state.contacts = state.contacts.filter((c) => c.id !== action.payload);
        if (state.currentContact?.id === action.payload) {
          state.currentContact = null;
        }
      })

      // ── restoreContact ─────────────────────────────────────────────────────
      .addCase(restoreContact.fulfilled, (state, action) => {
        // Remove the restored contact from the backup history table
        state.backupHistory = state.backupHistory.filter(
          (item) =>
            item.contacts?.[0]?.id !== action.payload &&
            item.id !== action.payload, // Some APIs might return the backup ID instead, filter both just in case
        );
      })

      // ── assignContactToList ────────────────────────────────────────────────
      .addCase(assignContactToList.fulfilled, (state, action) => {
        // Update source/list field in the flat contacts array
        const index = state.contacts.findIndex(
          (c) => c.id === action.payload.id,
        );
        if (index !== -1) {
          state.contacts[index].list = action.payload.source || "-";
        }
        // Update currentContact if it's the same one
        if (state.currentContact?.id === action.payload.id) {
          state.currentContact = action.payload;
        }
      })
      .addCase(assignContactToList.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ── assignAgentsToList ─────────────────────────────────────────────────
      // Updates the agentIds on the list in local Redux state
      .addCase(assignAgentsToList.fulfilled, (state, action) => {
        const { listId, agentIds } = action.payload;
        const list = state.lists.find((l) => l.id === listId);
        if (list) {
          list.agentIds = agentIds;
        }
      })
      .addCase(assignAgentsToList.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ── assignContactToGroups ──────────────────────────────────────────────
      .addCase(assignContactToGroups.fulfilled, (state, action) => {
        if (state.currentContact?.id === action.payload?.id) {
          state.currentContact = action.payload;
        }
      })
      .addCase(assignContactToGroups.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // ── fetchContactFolders ────────────────────────────────────────────────
      .addCase(fetchContactFolders.fulfilled, (state, action) => {
        state.folders = action.payload;
      })
      .addCase(createContactFolder.fulfilled, (state, action) => {
        state.folders.unshift(action.payload);
      })
      .addCase(updateContactFolder.fulfilled, (state, action) => {
        const index = state.folders.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.folders[index] = action.payload;
        }
      })
      .addCase(deleteContactFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter((f) => f.id !== action.payload);
      })
      .addCase(moveFolder.fulfilled, (state, action) => {
        const index = state.folders.findIndex((f) => f.id === action.payload.id);
        if (index !== -1) {
          state.folders[index] = action.payload;
        }
      })

      // ── fetchContactLists ──────────────────────────────────────────────────
      .addCase(fetchContactLists.fulfilled, (state, action) => {
        state.lists = action.payload;
      })
      .addCase(createContactList.fulfilled, (state, action) => {
        state.lists.unshift(action.payload);
      })
      .addCase(updateContactList.fulfilled, (state, action) => {
        const index = state.lists.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })
      .addCase(deleteContactList.fulfilled, (state, action) => {
        state.lists = state.lists.filter((l) => l.id !== action.payload);
      })
      .addCase(moveList.fulfilled, (state, action) => {
        const index = state.lists.findIndex((l) => l.id === action.payload.id);
        if (index !== -1) {
          state.lists[index] = action.payload;
        }
      })

      // ── fetchContactGroups ─────────────────────────────────────────────────
      .addCase(fetchContactGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      })
      .addCase(getAllExportContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllExportContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.exportHistory = action.payload;
      })
      .addCase(getAllExportContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(getAllImportedContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllImportedContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.importHistory = action.payload;
      })
      .addCase(getAllImportedContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(uploadAttachment.fulfilled, (state, action) => {
        if (state.currentContact) {
          if (!state.currentContact.attachments) {
            state.currentContact.attachments = [];
          }
          state.currentContact.attachments.push(action.payload);
        }
      })

      // ── deleteAttachment ───────────────────────────────────────────────────
      .addCase(deleteAttachment.fulfilled, (state, action) => {
        if (state.currentContact?.attachments) {
          state.currentContact.attachments =
            state.currentContact.attachments.filter(
              (a: any) => a.id !== action.payload,
            );
        }
      })

      .addCase(getAllBackupContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getAllBackupContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.backupHistory = action.payload;
      })
      .addCase(getAllBackupContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })

      // ── addContactNote ───────────────────────────────────────────────────
      .addCase(addContactNote.fulfilled, (state, action) => {
        if (state.currentContact && state.currentContact.id === action.payload.id) {
          state.currentContact = action.payload;
        }
        const index = state.contacts.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index].notes = action.payload.notes;
        }
      })
      .addCase(bulkAssignContactsToList.fulfilled, (state, action) => {
        const { contactIds, listName } = action.payload;
        
        state.contacts = state.contacts.map((c) => {
          if (contactIds.includes(c.id)) {
            return { ...c, list: listName || "-" };
          }
          return c;
        });
      })
      .addCase(bulkAssignContactsToFolder.fulfilled, (state, action) => {
        const { contactIds } = action.payload;
        // When moved to a folder, the contact might be removed from its current list view
        // or we just update the local state if needed.
        // For now, let's just refresh currentContact if it was one of them.
        if (state.currentContact && contactIds.includes(state.currentContact.id)) {
          state.currentContact = { ...state.currentContact, folderId: action.payload.folderId };
        }
      })
      .addCase(bulkMoveToDnc.fulfilled, (state, action) => {
        const contactIds = action.payload;
        state.contacts = state.contacts.filter((c) => !contactIds.includes(c.id));
      })
      .addCase(bulkDeleteContacts.fulfilled, (state, action) => {
        const contactIds = action.payload;
        state.contacts = state.contacts.filter(
          (c) => !contactIds.includes(c.id)
        );
        state.duplicateContacts = state.duplicateContacts.filter(
          (c) => !contactIds.includes(c.id)
        );
      })
      .addCase(mergeContacts.fulfilled, (state, action) => {
        const { duplicateIds, mergedContact } = action.payload;
        state.contacts = state.contacts.filter(
          (c) => !duplicateIds.includes(c.id)
        );
        // Remove duplicates and update master in duplicateContacts list if present
        state.duplicateContacts = state.duplicateContacts.filter(
          (c) => !duplicateIds.includes(c.id) && c.id !== mergedContact.id
        );
      })
      .addCase(fetchDuplicateContacts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDuplicateContacts.fulfilled, (state, action) => {
        state.isLoading = false;
        state.duplicateContacts = action.payload;
      })
      .addCase(fetchDuplicateContacts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setQueue, setCurrentContact, setCurrentContactFields, removeFromQueue } = contactSlice.actions;

export default contactSlice.reducer;

