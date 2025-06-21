import axios from "axios";

const handleUpdate = async function (body) {
    try {
        let response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/update`,
            body,
            {
                withCredentials: true,
            }
        );

        return response;
    } catch (error) {
        return error?.response;
    }
};

const handleGetUser = async function (id) {
    try {
        let response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/user/${id}`,
            {
                withCredentials: true,
            }
        );

        return response;
    } catch (error) {
        return error?.response;
    }
};

export { handleUpdate, handleGetUser }