import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../lib/axios";

export interface User {
  _id: string;
  email: string;
  fullName?: string;
  role?: string;
  status?: string;
  [key: string]: any;
}

interface UserState {
  users: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  users: [],
  loading: false,
  error: null,
};

export const getAllUsers = createAsyncThunk(
  "user/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/user");
      console.log("[userSlice] getAllUsers response:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to fetch users",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const createUser = createAsyncThunk(
  "user/createUser",
  async (userData: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/user", userData);
      console.log("[userSlice] createUser response:", response.data);
      return response.data;
    } catch (error: any) {
      if (error.response && error.response.data) {
        return rejectWithValue(
          error.response.data.message || "Failed to create user",
        );
      } else {
        return rejectWithValue(error.message);
      }
    }
  },
);

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAllUsers.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(getAllUsers.fulfilled, (state, action) => {
      state.loading = false;
      // Handle response.data.data or response.data
      const payloadData = action.payload?.data;
      if (Array.isArray(payloadData)) {
        state.users = payloadData;
      } else if (Array.isArray(action.payload)) {
        state.users = action.payload;
      } else {
        state.users = [];
      }
    });
    builder.addCase(getAllUsers.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });

    // Create User
    builder.addCase(createUser.pending, (state) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state) => {
      state.loading = false;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.payload as string;
    });
  },
});

export default userSlice.reducer;
