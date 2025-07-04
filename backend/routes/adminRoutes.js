import express from 'express';
import {
    getAllComplaints,
    updateComplaintStatus,
    manageUsers,
    getDashboardStats,
    login,
    getProfile,
    register

} from '../controllers/adminController.js';
import { authenticateAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all admin routes
router.use(authenticateAdmin);

// Complaint Management
router.get('/complaints', getAllComplaints);
router.patch('/complaints/:id/status', updateComplaintStatus);
// router.patch('/complaints/:id/assign', assignComplaint);

// User Management
router.get('/users', manageUsers); // List/Filter users
router.post('/users/staff', manageUsers); // Create staff accounts
router.patch('/users/:id', manageUsers); // Update user roles/status

// Admin Dashboard
router.get('/stats', getDashboardStats);



router.post('/login', login);
router.post(
    '/register',
    authenticateAdmin,
    checkRole(['SUPER_ADMIN']),
    register
);


router.get('/profile', authenticateAdmin, getProfile);

export default router;