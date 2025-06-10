import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { createRoot } from "react-dom/client";
import { Provider, useSelector } from "react-redux";
import { store, persistor } from "./redux/store.js";
import { PersistGate } from "redux-persist/integration/react";
import "./index.css";
import App from "./App.jsx";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import LandingPage from "./pages/LandingPage.jsx";
import Pricing from "./components/Pricing.jsx";
import PageNotFound from "./pages/PageNotFound.jsx";
import Profile from "./pages/Profile.jsx";
import TrainModel from "./pages/TrainModel.jsx";
import ModelDetail from "./pages/ModelDetail.jsx";

function ProtectedRoute({ children }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return isAuthenticated ? children : <LandingPage />;
}

function PublicRoute({ children }) {
    const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

    return isAuthenticated ? <Home /> : children;
}

const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            {
                path: "",
                element: (
                    <ProtectedRoute>
                        <LandingPage />
                    </ProtectedRoute>
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
                    <ProtectedRoute>
                        <Pricing />
                    </ProtectedRoute>
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
                path: "model-detail",
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

createRoot(document.getElementById("root")).render(
    <PersistGate persistor={persistor}>
        <Provider store={store}>
            <RouterProvider router={router} />
        </Provider>
    </PersistGate>
);
