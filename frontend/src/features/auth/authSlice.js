import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const initialState = {
    user: null,
    token: null,
    isLoading: false,
    error: null,
    isAuthenticated: false,
    _persist: undefined,
};

export const signupUser = createAsyncThunk(
    "accounts/signup",
    async ({ email, password, full_name }, { rejectWithValue }) => {
        try {
            console.log("Attempting signup with:", { email });
            const response = await axios.post(
                "http://127.0.0.1:8000/api/v1/accounts/signup/",
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

            localStorage.setItem("token", data.token);
            console.log(
                localStorage.getItem("token")
                    ? "Token saved"
                    : "Token not saved"
            );

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
    "accounts/signin",
    async ({ email, password }, { rejectWithValue }) => {
        try {
            console.log("Attempting signin with:", { email });

            const response = await axios.post(
                "http://127.0.0.1:8000/api/v1/accounts/signin/",
                { email, password },
                {
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = response.data;
            console.log("Signin response:", data);

            if (!data.success) {
                return rejectWithValue(data.message);
            }

            const result = {
                user: data.user,
                token: data.token,
                success: data.success,
            };

            localStorage.setItem("token", data.token);
            console.log(
                localStorage.getItem("token")
                    ? "Token saved"
                    : "Token not saved"
            );

            return result;
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

export const signoutUser = createAsyncThunk(
    "accounts/signout",
    async (_, { rejectWithValue, getState }) => {
        try {
            const token = getState().auth.token;

            const response = await axios.post(
                "http://127.0.0.1:8000/api/v1/accounts/signout/",
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            console.log("Signout response: ", response);

            const data = response.data;

            if (response.status !== 200) {
                return rejectWithValue(data.message);
            }

            return data;
        } catch (error) {
            return rejectWithValue(error.message);
        }
    }
);

export const updateProfile = createAsyncThunk(
    "accounts/updateProfile",
    async (_, { rejectWithValue, getState }) => {
        const token = getState().auth.token;

        const response = await axios.get(
            "http://127.0.0.1:8000/api/v1/accounts/profile/",
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (response.status !== 200) {
            return rejectWithValue(
                response.data?.message || "Failed to fetch profile."
            );
        }

        return response.data;
    }
);

export const updateLikedModel = createAsyncThunk(
    "accounts/updateLikedModel",
    async (modelId, { getState, rejectWithValue }) => {
        try {
            const token = getState().auth.token;

            const response = await axios.put(
                `http://127.0.0.1:8000/api/v1/accounts/update-liked-model/${modelId}/`,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                    withCredentials: true,
                }
            );

            const data = response.data;

            if (!data.success) {
                return rejectWithValue(data.message);
            }

            console.log("data is ", data.data);

            return data;
        } catch (error) {
            return rejectWithValue(
                error.response?.data?.message ||
                    error.message ||
                    "Network error"
            );
        }
    }
);

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.token = null;
            state.isAuthenticated = false;
            state.error = null;
        },
        setTestAuth: (state) => {
            state.user = { email: "test@example.com", id: "123" };
            state.token = "test-token-123";
            state.isAuthenticated = true;
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(signupUser.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signupUser.fulfilled, (state, action) => {
                console.log("Signup fulfilled:", action.payload);
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
            })
            .addCase(signupUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(signinUser.pending, (state) => {
                console.log("Signin pending");
                state.isLoading = true;
                state.error = null;
            })
            .addCase(signinUser.fulfilled, (state, action) => {
                console.log("Signin fulfilled with payload:", action.payload);
                state.isLoading = false;
                state.user = action.payload.user;
                state.token = action.payload.token;
                state.isAuthenticated = true;
                state.error = null;
                console.log("New auth state:", {
                    user: state.user,
                    token: state.token,
                    isAuthenticated: state.isAuthenticated,
                });
            })
            .addCase(signinUser.rejected, (state, action) => {
                console.log("Signin rejected:", action.payload);
                state.isLoading = false;
                state.error = action.payload;
                state.isAuthenticated = false;
            })

            .addCase(signoutUser.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(signoutUser.fulfilled, (state) => {
                console.log("Signout fulfilled");
                state.isLoading = false;
                state.user = null;
                state.token = null;
                state.isAuthenticated = false;
                state.error = null;

                localStorage.removeItem("token");
            })
            .addCase(signoutUser.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(updateProfile.pending, (state) => {
                state.isLoading = true;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                console.log("update Profile : ", action.payload);
                state.user = action.payload;
                state.isLoading = false;
                console.log("State after update profile", state.user);
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            })

            .addCase(updateLikedModel.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(updateLikedModel.fulfilled, (state, action) => {
                state.isLoading = false;
                state.error = null;

                const { data } = action.payload;
                const { action: likeState, model_id: modelId } = data;

                if (likeState === "like") {
                    if (!state.user.liked_models.includes(modelId)) {
                        state.user.liked_models.push(modelId);
                    }
                    console.log("===================================");
                    console.log(state.user);
                } else if (likeState === "dislike") {
                    state.user.liked_models = state.user.liked_models.filter(
                        (id) => id !== modelId
                    );
                    console.log("===================================");
                    console.log(state.user);
                }
            })
            .addCase(updateLikedModel.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload;
            });
    },
});

export const { clearError, logout, setTestAuth } = authSlice.actions;
export default authSlice.reducer;
