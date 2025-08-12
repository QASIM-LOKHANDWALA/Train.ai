import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { store, persistor } from "./redux/store.js";
import { router } from "./Router.jsx";
import "./index.css";

createRoot(document.getElementById("root")).render(
    <Provider store={store}>
        <PersistGate persistor={persistor}>
            <RouterProvider router={router} />
        </PersistGate>
    </Provider>
);
