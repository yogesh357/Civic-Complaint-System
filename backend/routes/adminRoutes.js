import express from 'express';
import {
    getAllComplaints,
    updateComplaintStatus,
    manageUsers,
    getDashboardStats,
    assignComplaint,
    createStaff
} from '../controllers/adminController.js';
import { isAdmin } from '../middlewares/authMiddleware.js';

const router = express.Router();

// Protect all admin routes
router.use(isAdmin);

// Complaint Management
router.get('/complaints', getAllComplaints);
router.patch('/complaints/:id/status', updateComplaintStatus);
router.patch('/complaints/:id/assign', assignComplaint);

// User Management
router.get('/users', manageUsers); // List/Filter users
router.post('/users/staff', createStaff); // Create staff accounts
router.patch('/users/:id', manageUsers); // Update user roles/status

// Admin Dashboard
router.get('/stats', getDashboardStats);

export default router;