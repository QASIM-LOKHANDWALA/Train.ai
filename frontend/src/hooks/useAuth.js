import { useSelector, useDispatch } from "react-redux";
import { useEffect } from "react";
import {
    signupUser,
    signinUser,
    signoutUser,
    updateLikedModel,
    clearError,
    logout,
} from "../features/auth/authSlice";

export const useAuth = () => {
    const dispatch = useDispatch();
    const { user, token, isLoading, error, isAuthenticated } = useSelector(
        (state) => state.auth
    );

    const signup = (credentials) => {
        return dispatch(signupUser(credentials));
    };

    const signin = (credentials) => {
        return dispatch(signinUser(credentials));
    };

    const signout = () => {
        return dispatch(signoutUser());
    };

    const clearAuthError = () => {
        dispatch(clearError());
    };

    const logoutUser = () => {
        dispatch(logout());
    };

    const updateLike = (modelId) => {
        return dispatch(updateLikedModel(modelId));
    };

    return {
        user,
        token,
        isLoading,
        error,
        isAuthenticated,
        signup,
        signin,
        signout,
        clearAuthError,
        logoutUser,
        updateLike,
    };
};
