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
}



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
        const contact = response.data.data;

        // If a list ID was provided, append this contact to that list
        if (payload.contactListId) {
          await api.patch(`/contact/list/${payload.contactListId}`, {
            contactIds: [contact.id]
          });
        }

        return contact;
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

export const contactSlice = createSlice({
  name: 'contacts',
  initialState,
  reducers: {
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    setCurrentContact: (state, action) => {
      state.currentContact = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
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
      .addCase(createContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createContact.fulfilled, (state, action) => {
        state.isLoading = false;
        // Map the created contact back to the local Contact interface if needed
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
      .addCase(updateContact.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateContact.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentContact = action.payload;
        // Also update in the contacts list if it exists there
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
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
      .addCase(assignContactToList.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentContact = action.payload;
        // The source field is updated in action.payload
        const index = state.contacts.findIndex(c => c.id === action.payload.id);
        if (index !== -1) {
          state.contacts[index].list = action.payload.source || "-";
        }
      })
      .addCase(assignContactToList.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchContactFolders.fulfilled, (state, action) => {
        state.folders = action.payload;
      })
      .addCase(fetchContactLists.fulfilled, (state, action) => {
        state.lists = action.payload;
      })
      .addCase(fetchContactGroups.fulfilled, (state, action) => {
        state.groups = action.payload;
      });
  },
});

export const { setQueue, setCurrentContact } = contactSlice.actions;

export default contactSlice.reducer;
