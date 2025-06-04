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

            const data = response.data;

            if (!data.success) {
                return rejectWithValue(data.message);
            }

            return data;
        } catch (error) {
            if (error.response && error.response.data) {
                return rejectWithValue(
                    error.response.data.message || "Server error"
                );
            }
            return rejectWithValue(error.message || "Network error");
        }
    }
);

export const signinUser = createAsyncThunk(
    "auth/signin",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            console.log("Attempting signin with:", { email });

            const response = await axios.post(
                "http://127.0.0.1:5050/api/v1/auth/signin",
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;
            console.log("Response data:", data);

            if (!data.success) {
                return rejectWithValue(data.message);
            }

            if (data.token) {
                localStorage.setItem("token", data.token);
                console.log("Token stored successfully");
            }

            console.log("Signin successful:", data);
            return data;
        } catch (error) {
            console.error("Signin error:", error);
            if (error.response && error.response.data) {
                return rejectWithValue(
                    error.response.data.message || "Server error"
                );
            }
            return rejectWithValue(error.message || "Network error");
        }
    }
);

export const signoutUser = createAsyncThunk(
    "auth/signout",
    async (_, { rejectWithValue, getState }) => {
        try {
            const token =
                getState().auth.token || localStorage.getItem("token");

            const response = await fetch(
                "http://127.0.0.1:5050/api/v1/auth/signout",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        client: "not-browser",
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                return rejectWithValue(data.message);
            }

            localStorage.removeItem("token");

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const authSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            localStorage.removeItem("token");
        },
    },
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

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;
