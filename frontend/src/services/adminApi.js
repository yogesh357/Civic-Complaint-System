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

export const adminLogout = async () => {
    return axiosInstance.get('/api/admin/logout')
}

export const currentAdmin = async () => {
    return await axiosInstance.get('/api/admin/profile')
}

export const fetchAllComplaints = async () => {
    const response = await axiosInstance.get('/api/admin/complaints')

    return response.data
}

export const updateComplaintStatus = async (complaintId, status, adminComment) => {
    const response = await axiosInstance.patch(`/api/admin/complaint/${complaintId}/status`, { status, adminComment })
    console.log("data from update status", response)
    return response.data.data
}

export const getAllUsers = async () => {
    const response = await axiosInstance.get('/api/admin/users')
    return response.data
}

export const trackComplaint = async (id) => {
    const response = await axiosInstance.get(`/api/admin/complaint/${id}`)
    return response.data
}

export const updateUser = async (userData, userId) => {
    return await axiosInstance.patch(`/api/admin/users/${userId}`, { userData })
}
export const getDashboardStats = async () => {
    return await axiosInstance.get('/api/admin/stats')
}
