import axiosInstance from "./axiosInstance";



export const adminLogin = async (email, password) => {
    return await axiosInstance.post('/api/admin/login', {
        email, password
    })
}

export const adminRegister = async (name, email, password) => { 
    return await axiosInstance.post('/api/admin/register', {
        name, email, password
    },
    )
}

export const currentAdmin = async () => {
    return await axiosInstance.get('/api/admin/profile')
}

export const fetchAllComplaints = async () => {
    return await axiosInstance.get('/api/admin/complaints')
}

export const updateComplaintStatus = async (complaintId, status) => {
    return await axiosInstance.patch(`/api/admin/complaint/${complaintId}/status`, { status })
}

export const fetchAllUsers = async () => {
    return await axiosInstance.get('/api/admin/users')
}

export const updateUser = async (userData, userId) => {
    return await axiosInstance.patch(`/api/admin/users${userId}`, { userData })
}
export const getDashboardStats = async () => {
    return await axiosInstance.get('/api/admin/stats')
}
