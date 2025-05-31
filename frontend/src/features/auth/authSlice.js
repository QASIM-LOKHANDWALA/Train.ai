import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    token: localStorage.getItem("token") || null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
};

export const signupUser = createAsyncThunk(
    "auth/signup",
    async ({ email, password, full_name }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:5050/api/v1/auth/signup",
                { email, password, full_name },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    withCredentials: true,
                }
            );

            if (!response.success) {
                return rejectWithValue(response.message);
            }

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const signinUser = createAsyncThunk(
    "auth/signin",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            const response = await axios.post(
                "http://127.0.0.1:5050/api/v1/auth/signin",
                { email, password }
            );

            if (!response.success) {
                return rejectWithValue(response.message);
            }

            if (response.token) {
                localStorage.setItem("token", response.token);
            }

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const signoutUser = createAsyncThunk(
    "auth/signout",
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:5050/api/v1/auth/signout"
            );

            if (!response.success) {
                return rejectWithValue(response.message);
            }

            localStorage.removeItem("token");

            return response;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const authSlice = createSlice({
    name: "user",
    initialState,
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(signinUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signinUser.fulfilled, (state, action) => {
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signinUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            .addCase(signoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signoutUser.fulfilled, (state) => {
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;
            })
            .addCase(signoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const {} = authSlice.actions;
export default authSlice.reducer;
