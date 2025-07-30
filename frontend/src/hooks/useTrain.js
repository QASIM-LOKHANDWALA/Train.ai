import axios from "axios";

export const useTrain = () => {
    const trainModel = async (model_name, target_col, csv_file, endpoint) => {
        try {
            const token = localStorage.getItem("token");

            if (!(csv_file instanceof File)) {
                throw new Error("csv_file must be a valid File object");
            }

            const formData = new FormData();
            formData.append("model_name", model_name);
            formData.append("target_col", target_col);
            formData.append("endpoint", endpoint);
            formData.append("csv_file", csv_file);

            const response = await axios.post(
                "http://127.0.0.1:8000/api/v1/trained-model/train/",
                formData,
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error("Error training model in useTrain:", error);
            return { success: false, error: error.message };
        }
    };

    return { trainModel };
};
