import axios from 'axios';

const url='http://localhost:5050/api/v1';

export const axiosInstance=axios.create({
    baseURL: url,
    withCredentials: true,
});
