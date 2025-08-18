import { useState } from "react";
import axios from "axios";

const useApi = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const DJANGO_BASE_URL = "http://127.0.0.1:8000";

    const makeRequest = async (method, url, data = null, options = {}) => {
        setLoading(true);
        setError(null);

        try {
            const config = {
                method,
                url: `${DJANGO_BASE_URL}${url}`,
                withCredentials: true,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                    ...options.headers,
                },
                ...options,
            };

            if (data) {
                config.data = data;
            }

            const response = await axios(config);
            setLoading(false);
            return response.data;
        } catch (err) {
            setLoading(false);
            const errorMessage =
                err.response?.data?.message ||
                err.message ||
                "An error occurred";
            setError(errorMessage);
            throw err;
        }
    };

    const get = (url, options = {}) => makeRequest("GET", url, null, options);
    const post = (url, data, options = {}) =>
        makeRequest("POST", url, data, options);
    const put = (url, data, options = {}) =>
        makeRequest("PUT", url, data, options);
    const del = (url, options = {}) =>
        makeRequest("DELETE", url, null, options);

    const predictModel = async (modelId, features) => {
        return post(`/api/v1/trained-model/detail/${modelId}/`, { features });
    };

    return {
        loading,
        error,
        get,
        post,
        put,
        del,
        predictModel,
        clearError: () => setError(null),
    };
};

export default useApi;
