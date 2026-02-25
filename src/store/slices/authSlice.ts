import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../lib/axios';
// import { authClient } from '@/lib/auth-client';

export type UserRole = 'ADMIN' | 'AGENT' | 'OWNER' | 'SUPER_ADMIN';

export interface LoginPayload {
    email: string;
    password?: string;
    role: UserRole;
}

interface AuthState {
    loading: boolean;
    error: string | null;
    isAuthenticated: boolean;
    token: string | null;
    role: UserRole | null;
    session: any | null;
}

// Helper to get initial state from localStorage
const getInitialState = (): AuthState => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role') as UserRole | null;
    const sessionStr = localStorage.getItem('session');
    let session = null;
    try {
        session = sessionStr ? JSON.parse(sessionStr) : null;
    } catch (e) {
        console.error("Error parsing session from localStorage", e);
    }

    return {
        loading: false,
        error: null,
        isAuthenticated: !!token,
        token: token,
        role: role,
        session: session,
    };
};

const initialState: AuthState = getInitialState();

export interface SignupPayload {
    fullName: string;
    email: string;
    password?: string;
    status: string;
    role: string;
    callBackURL?: string;
}


export const signup = createAsyncThunk(
    'auth/signup',
    async (payload: SignupPayload, { rejectWithValue }) => {
        try {
            const signupData = {
                ...payload,
                callBackURL: payload.callBackURL || "https://multi-dialer-fe.vercel.app/admin/login"
            };
            console.log("Frontend sending signup payload:", signupData);
            const response = await api.post('/auth/sign-up/email', signupData);
            console.log(response.data);
            return response.data;
        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Signup failed');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);




export const login = createAsyncThunk(
    'auth/login',
    async (payload: Omit<LoginPayload, 'role'>, { rejectWithValue }) => {
        try {
            const loginData = {
                email: payload.email,
                password: payload.password
            };
            console.log("Frontend sending login payload:", loginData);
            const response = await api.post('/auth/sign-in/email', loginData);

            // We return the full data but don't save to localStorage yet
            return response.data;

        } catch (error: any) {
            if (error.response && error.response.data) {
                return rejectWithValue(error.response.data.message || 'Login failed');
            } else {
                return rejectWithValue(error.message);
            }
        }
    }
);




export const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setAuthData: (state, action: { payload: { token: string; role: UserRole; session: any } }) => {
            const { token, role, session } = action.payload;
            state.token = token;
            state.role = role;
            state.session = session;
            state.isAuthenticated = true;
            state.error = null;

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('session', JSON.stringify(session));
        },
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            localStorage.removeItem('session');
            state.isAuthenticated = false;
            state.token = null;
            state.role = null;
            state.session = null;
            state.error = null;
        }
    },
    extraReducers: (builder) => {
        // Login
        builder.addCase(login.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(login.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(login.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });

        // Signup
        builder.addCase(signup.pending, (state) => {
            state.loading = true;
            state.error = null;
        });
        builder.addCase(signup.fulfilled, (state) => {
            state.loading = false;
        });
        builder.addCase(signup.rejected, (state, action) => {
            state.loading = false;
            state.error = action.payload as string;
        });
    },
});

export const { logout, setAuthData } = authSlice.actions;
export default authSlice.reducer;
