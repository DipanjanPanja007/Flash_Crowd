import axios from "axios";

const handleSendFriendRequest = async function (body) {
    try {
        let response = await axios.post(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/sendRequest`,
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

const handleDeleteRequest = async function (body) {
    try {
        let response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/deleteRequest`,
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

const handleRemoveRequest = async function (body) {
    try {
        let response = await axios.delete(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/removeFriend`,
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

const handleAcceptRequest = async function (body) {
    try {
        let response = await axios.put(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/acceptRequest`,
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

const handleGetStatus = async function (body) {
    try {
        let response = await axios.get(
            `${import.meta.env.VITE_BACKEND_URI}/api/v1/friend/status`,
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




export { handleSendFriendRequest, handleAcceptRequest, handleDeleteRequest, handleRemoveRequest, handleGetStatus };