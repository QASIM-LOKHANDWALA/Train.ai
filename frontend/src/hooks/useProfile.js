import axios from "axios";
import { useAuth } from "./useAuth";

export const useProfile = () => {
    const { token } = useAuth();

    const getTrainedModels = async () => {
        try {
            const response = await axios.get(
                "http://127.0.0.1:8000/api/v1/trained-model/user",
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.log(`Error Fetching Trained Models: ${error.message}`);
        }
    };

    const getLikedModels = async (likedModelIds) => {
        try {
            const response = await axios.post(
                `http://127.0.0.1:8000/api/v1/trained-model/user/liked-models/`,
                {
                    models: likedModelIds,
                },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            console.log(response);

            if (response.status === 200) {
                return response.data;
            }
        } catch (error) {
            console.log(`Error Fetching Liked Models: ${error.message}`);
        }
    };

    return {
        getTrainedModels,
        getLikedModels,
    };
};
