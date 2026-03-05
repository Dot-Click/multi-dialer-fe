import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';

export interface Contact {
  id: string;
  name: string;
  lastDialedDate: string;
  phone: string;
  email: string;
  list: string;
  tags: string;
  miscValues?: any;
  leadsheetValues?: any;
}

interface ContactState {
  contacts: Contact[];
  currentContact: any | null;
  queue: any[];
  folders: ContactFolder[];
  lists: ContactList[];
  groups: ContactGroup[];
  isLoading: boolean;
  error: string | null;
}

export interface ContactList {
  id: string;
  name: string;
  contactIds: string[];
  agentIds: string[];
  createdAt: string;
}

export interface ContactFolder {
  id: string;
  name: string;
  listIds: string[];
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
  currentContact: null,
  queue: [],
  folders: [],
  lists: [],
  groups: [],
  isLoading: false,
  error: null,
};

export interface CreateContactEmail {
  email: string;
  isPrimary: boolean;
}

export interface CreateContactPhone {
  number: string;
  type: "MOBILE" | "TELEPHONE" | "HOME" | "WORK";
}

export interface CreateContactPayload {
  fullName: string;
  city?: string;
  state?: string;
  zip?: string;
  source?: string;
  tags?: string[];
  dataDialerId?: string;
  emails: CreateContactEmail[];
  phones: CreateContactPhone[];
  contactListId?: string;
  miscValues?: any;
  leadsheetValues?: any;
}

// ---------------------------------------------------------------------------
// THUNKS
// ---------------------------------------------------------------------------

export const fetchContacts = createAsyncThunk(
  'contacts/fetchContacts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contact');
      if (response.data.success) {
        return response.data.data.map((c: any) => ({
          id: c.id,
          name: c.fullName || "-",
          lastDialedDate: "-",
          phone: c.phones?.[0]?.number || "-",
          email: c.emails?.[0]?.email || "-",
          list: c.source || "-",
          tags: c.tags.length > 0 ? c.tags.join(", ") : "-",
        }));
      }
      return rejectWithValue('Failed to fetch contacts');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching contacts');
    }
  }
);

export const fetchContactsByList = createAsyncThunk(
  'contacts/fetchContactsByList',
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
          tags: c.tags.length > 0 ? c.tags.join(", ") : "-",
        }));
      }
      return rejectWithValue('Failed to fetch contacts for this list');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching contacts for this list');
    }
  }
);

export const fetchContactById = createAsyncThunk(
  'contacts/fetchContactById',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/contact/${id}`);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to fetch contact details');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching contact details');
    }
  }
);

export const createContact = createAsyncThunk(
  'contacts/createContact',
  async (payload: CreateContactPayload, { rejectWithValue }) => {
    try {
      const response = await api.post('/contact/create', payload);
      if (response.data.success) {
        // Backend handles adding contact to the list inside the transaction
        // Do NOT call PATCH /list/:id here — that would wipe contactIds
        return response.data.data;
      }
      return rejectWithValue('Failed to create contact');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error creating contact');
    }
  }
);

export const updateContact = createAsyncThunk(
  'contacts/updateContact',
  async ({ id, payload }: { id: string; payload: any }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/contact/${id}`, payload);
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to update contact');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error updating contact');
    }
  }
);

export const deleteContact = createAsyncThunk(
  'contacts/deleteContact',
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/contact/${id}`);
      if (response.data.success) {
        return id;
      }
      return rejectWithValue('Failed to delete contact');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting contact');
    }
  }
);

// Assigns a contact to a list (moves the contact, updates source field)
export const assignContactToList = createAsyncThunk(
  'contacts/assignContactToList',
  async ({ contactId, listId }: { contactId: string; listId: string }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/contact/${contactId}/assign`, { listId });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to assign contact to list');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error assigning contact to list');
    }
  }
);

// Assigns agents (user IDs) to a list — admin only, separate from contact assignment
export const assignAgentsToList = createAsyncThunk(
  'contacts/assignAgentsToList',
  async ({ listId, agentIds }: { listId: string; agentIds: string[] }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/contact/list/${listId}/agents`, { agentIds });
      if (response.data.success) {
        return { listId, agentIds, data: response.data.data };
      }
      return rejectWithValue('Failed to assign agents');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error assigning agents');
    }
  }
);

export const assignContactToGroups = createAsyncThunk(
  'contacts/assignContactToGroups',
  async ({ contactId, groupIds }: { contactId: string; groupIds: string[] }, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/contact/${contactId}/groups`, { groupIds });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to assign contact to groups');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error assigning contact to groups');
    }
  }
);

export const fetchContactFolders = createAsyncThunk(
  'contacts/fetchContactFolders',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contact/folder');
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to fetch contact folders');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching contact folders');
    }
  }
);

export const fetchContactLists = createAsyncThunk(
  'contacts/fetchContactLists',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contact/list');
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to fetch contact lists');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching contact lists');
    }
  }
);

export const fetchContactGroups = createAsyncThunk(
  'contacts/fetchContactGroups',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/contact/group');
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to fetch contact groups');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching contact groups');
    }
  }
);

export const sendLeadSheetEmail = createAsyncThunk(
  'contacts/sendLeadSheetEmail',
  async (
    { contactId, leadSheetId, recipientEmail }: { contactId: string; leadSheetId: string; recipientEmail: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(`/contact/${contactId}/leadsheet/send-email`, {
        leadSheetId,
        recipientEmail,
      });
      if (response.data.success) {
        return response.data;
      }
      return rejectWithValue('Failed to send lead sheet email');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error sending lead sheet email');
    }
  }
);

export const uploadAttachment = createAsyncThunk(
  'contacts/uploadAttachment',
  async ({ contactId, file }: { contactId: string; file: File }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await api.post(`/contact/${contactId}/attachment`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      if (response.data.success) {
        return response.data.data;
      }
      return rejectWithValue('Failed to upload attachment');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error uploading attachment');
    }
  }
);

export const deleteAttachment = createAsyncThunk(
  'contacts/deleteAttachment',
  async (attachmentId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`/contact/attachment/${attachmentId}`);
      if (response.data.success) {
        return attachmentId;
      }
      return rejectWithValue('Failed to delete attachment');
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error deleting attachment');
    }
  }
);

// ---------------------------------------------------------------------------
// SLICE
// ---------------------------------------------------------------------------

export const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    setCurrentContact: (state, action) => {
      state.currentContact = action.payload;
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

      // ── fetchContactById ───────────────────────────────────────────────────
      .addCase(fetchContactById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
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
          tags: action.payload.tags?.length > 0 ? action.payload.tags.join(", ") : "-",
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
        const index = state.contacts.findIndex((c) => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index] = {
            id: action.payload.id,
            name: action.payload.fullName || "-",
            lastDialedDate: "-",
            phone: action.payload.phones?.[0]?.number || "-",
            email: action.payload.emails?.[0]?.email || "-",
            list: action.payload.source || "-",
            tags: action.payload.tags?.length > 0 ? action.payload.tags.join(", ") : "-",
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

      // ── assignContactToList ────────────────────────────────────────────────
      .addCase(assignContactToList.fulfilled, (state, action) => {
        // Update source/list field in the flat contacts array
        const index = state.contacts.findIndex((c) => c.id === action.payload.id);
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

      // ── fetchContactLists ──────────────────────────────────────────────────
      .addCase(fetchContactLists.fulfilled, (state, action) => {
        state.lists = action.payload;
      })

      // ── fetchContactGroups ─────────────────────────────────────────────────
      .addCase(fetchContactGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      })

      // ── uploadAttachment ───────────────────────────────────────────────────
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
          state.currentContact.attachments = state.currentContact.attachments.filter(
            (a: any) => a.id !== action.payload
          );
        }
      });
  },
});

export const { setQueue, setCurrentContact } = contactSlice.actions;

export default contactSlice.reducer;