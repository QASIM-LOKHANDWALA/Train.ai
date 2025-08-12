import { createBrowserRouter, Navigate } from "react-router-dom";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Pricing from "./components/Pricing.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Profile from "./pages/Profile.jsx";
import TrainModel from "./pages/TrainModel.jsx";
import ModelDetail from "./pages/ModelDetail.jsx";
import { useSelector } from "react-redux";

function ProtectedRoute({ children }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return isAuthenticated ? children : <Navigate to="/auth" replace />;
}

function PublicRoute({ children }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
    return isAuthenticated ? <Navigate to="/home" replace /> : children;
}

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                index: true,
                element: (
                    <PublicRoute>
                        <LandingPage />
                    </PublicRoute>
                ),
            },
            {
                path: "home",
                element: (
                    <ProtectedRoute>
                        <Home />
                    </ProtectedRoute>
                ),
            },
            {
                path: "pricing",
                element: (
                    <PublicRoute>
                        <Pricing />
                    </PublicRoute>
                ),
            },
            {
                path: "profile",
                element: (
                    <ProtectedRoute>
                        <Profile />
                    </ProtectedRoute>
                ),
            },
            {
                path: "train",
                element: (
                    <ProtectedRoute>
                        <TrainModel />
                    </ProtectedRoute>
                ),
            },
            {
                path: "model-detail/:id",
                element: (
                    <ProtectedRoute>
                        <ModelDetail />
                    </ProtectedRoute>
                ),
            },
        ],
    },
    {
        path: "auth",
        element: (
            <PublicRoute>
                <Login />
            </PublicRoute>
        ),
    },
    {
        path: "*",
        element: <PageNotFound />,
    },
]);
