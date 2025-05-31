import { createStore } from "@reduxjs/toolkit";
import { authSlice } from "../features/auth/authSlice.js";

export const store = createStore({
    reducer: {
        auth: authSlice.reducer,
    },
});
