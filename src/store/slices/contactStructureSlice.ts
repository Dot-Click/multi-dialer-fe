import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';
import { createContact } from './contactSlice';

export interface ContactFolder {
  id: string;
  name: string;
  parentId?: string; // Added for nested folders
  listIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactList {
  id: string;
  name: string;
  folderId?: string | null;
  agentIds: string[];
  contactIds: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ContactGroup {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
}

interface ContactStructureState {
  folders: ContactFolder[];
  lists: ContactList[];
  groups: ContactGroup[];
  isLoading: boolean;
  error: string | null;
}

const initialState: ContactStructureState = {
  folders: [],
  lists: [],
  groups: [],
  isLoading: false,
  error: null,
};

// Async Thunks for Fetching
export const fetchFolders = createAsyncThunk('contactStructure/fetchFolders', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/contact/folder');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch folders');
  }
});

export const fetchLists = createAsyncThunk('contactStructure/fetchLists', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/contact/list');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch lists');
  }
});

export const fetchGroups = createAsyncThunk('contactStructure/fetchGroups', async (_, { rejectWithValue }) => {
  try {
    const response = await api.get('/contact/group');
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to fetch groups');
  }
});

// Async Thunks for Creation
export const createFolder = createAsyncThunk('contactStructure/createFolder', async ({ name, parentId }: { name: string, parentId?: string }, { rejectWithValue }) => {
  try {
    const response = await api.post('/contact/folder', { name, parentId });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create folder');
  }
});

export const createList = createAsyncThunk(
  'contactStructure/createList',
  async ({ name, folderId }: { name: string; folderId?: string }, { rejectWithValue }) => {
    try {
      const response = await api.post('/contact/list', { name, folderId });
      const list = response.data.data;
      if (folderId) {
        await api.patch(`/contact/folder/${folderId}`, { listIds: [list.id] });
      }
      return { list, folderId };

    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create list');
    }
  }
);

export const createGroup = createAsyncThunk('contactStructure/createGroup', async (name: string, { rejectWithValue }) => {
  try {
    const response = await api.post('/contact/group', { name });
    return response.data.data;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to create group');
  }
});

// Async Thunks for Deletion
export const deleteFolder = createAsyncThunk('contactStructure/deleteFolder', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/contact/folder/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete folder');
  }
});

export const deleteList = createAsyncThunk('contactStructure/deleteList', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/contact/list/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete list');
  }
});

export const deleteGroup = createAsyncThunk('contactStructure/deleteGroup', async (id: string, { rejectWithValue }) => {
  try {
    await api.delete(`/contact/group/${id}`);
    return id;
  } catch (err: any) {
    return rejectWithValue(err.response?.data?.message || 'Failed to delete group');
  }
});


export const contactStructureSlice = createSlice({
  name: 'contactStructure',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Folders
      .addCase(fetchFolders.pending, (state) => { state.isLoading = true; })
      .addCase(fetchFolders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.folders = action.payload;
      })
      .addCase(fetchFolders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Lists
      .addCase(fetchLists.pending, (state) => { state.isLoading = true; })
      .addCase(fetchLists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.lists = action.payload;
      })
      .addCase(fetchLists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Groups
      .addCase(fetchGroups.pending, (state) => { state.isLoading = true; })
      .addCase(fetchGroups.fulfilled, (state, action) => {
        state.isLoading = false;
        state.groups = action.payload;
      })
      .addCase(fetchGroups.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Folder
      .addCase(createFolder.fulfilled, (state, action) => {
        state.folders.push(action.payload);
      })
      // Create List
      .addCase(createList.fulfilled, (state, action) => {
        const { list, folderId } = action.payload;
        state.lists.push(list);

        const folder = state.folders.find(f => f.id === folderId);
        if (folder) {
          if (!folder.listIds) folder.listIds = [];
          folder.listIds.push(list.id);
        }
      })
      // Create Group
      .addCase(createGroup.fulfilled, (state, action) => {
        state.groups.push(action.payload);
      })
      // Sync list membership when contact is created
      .addCase(createContact.fulfilled, (state, action) => {
        const contact = action.payload;
        // The payload for createContact includes contactListId
        // However, the action.meta.arg contains the original payload sent to the thunk
        const contactListId = action.meta.arg.contactListId;

        if (contactListId) {
          const list = state.lists.find(l => l.id === contactListId);
          if (list) {
            if (!list.contactIds) list.contactIds = [];
            list.contactIds.push(contact.id);
          }
        }
      })
      // Delete Folder
      .addCase(deleteFolder.fulfilled, (state, action) => {
        state.folders = state.folders.filter(f => f.id !== action.payload);
      })
      // Delete List
      .addCase(deleteList.fulfilled, (state, action) => {
        const listId = action.payload;
        state.lists = state.lists.filter(l => l.id !== listId);
        // Also remove from folders
        state.folders.forEach(folder => {
          if (folder.listIds) {
            folder.listIds = folder.listIds.filter(id => id !== listId);
          }
        });
      })
      // Delete Group
      .addCase(deleteGroup.fulfilled, (state, action) => {
        state.groups = state.groups.filter(g => g.id !== action.payload);
      })
  },
});

export default contactStructureSlice.reducer;
