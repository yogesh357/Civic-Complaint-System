// import axiosInstance from "./axiosInstance"

// export const loginUser = async (email, password) => {
//     const { data } = await axiosInstance.post('/api/user/login', { password, email })
//     return data;

// }

// export const registerUser = async (state, name , email, password)=>{
//     const {data} = await axiosInstance.post(`/api/user/${state}` ,{name,email,password})
//     return data;

// }
import axiosInstance from './axiosInstance';

export const registerUser = async (name, email, password) => {
    const { data } = await axiosInstance.post('/api/user/register', {
        name,
        email,
        password
    });
    return data;
};

export const loginUser = async (email, password) => {
    const { data } = await axiosInstance.post('/api/user/login', {
        email,
        password
    });
    return data;
};

export const logoutUser = async () => {
    const response = await axiosInstance.get('/api/user/logout')
    
    return response.data
}

export const fetchUser = async()=>{
    const response = await axiosInstance.get('/api/user/is-auth') 
    return response.data
}