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
  isLoading: boolean;
  error: string | null;
}

const initialState: ContactState = {
  contacts: [],
  currentContact: null,
  queue: [],
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
      });
  },
});

export const { setQueue, setCurrentContact } = contactSlice.actions;

export default contactSlice.reducer;
