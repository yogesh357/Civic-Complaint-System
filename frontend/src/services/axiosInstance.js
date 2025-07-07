import axios from 'axios'

// axios.defaults.withCredentials = true
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,

});


export default axiosInstance

// axiosInstance.interceptors.request.use((config) => {
//     const token = localStorage.getItem('token');
//     if (token) {
//         config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
// }, (error) => {
//     return Promise.reject(error);
// });
