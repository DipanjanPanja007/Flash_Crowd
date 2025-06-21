import axios from 'axios';

const url=`${import.meta.env.VITE_BACKEND_URI}/api/v1`;

export const axiosInstance=axios.create({
    baseURL: url,
    withCredentials: true,
});
