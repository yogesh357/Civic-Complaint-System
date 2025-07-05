import axios from 'axios'

// axios.defaults.withCredentials = true
// axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

const axiosInstance = axios.create({
    baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true,

});

export default axiosInstance

