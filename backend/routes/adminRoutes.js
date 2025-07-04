import express from 'express';
import {
    getAllComplaints,
    updateComplaintStatus,
    manageUsers,
    getDashboardStats,
    login,
    getProfile,
    createFirstAdmin,
    register
} from '../controllers/adminController.js';
import { authenticateAdmin, checkRole, validateRequest } from '../middlewares/authMiddleware.js';
import { adminRegistrationSchema } from '../schemas/adminSchema.js';

const router = express.Router();

// Public routes (no auth required)
router.post('/login', login);
router.post('/setup', createFirstAdmin);



router.use(authenticateAdmin); // Applies to all routes below

// Admin management routes
router.post(
    '/register',
    checkRole(['ADMIN']), // Only existing admins can register new admins
    validateRequest(adminRegistrationSchema),
    register
);

// Protected routes

router.get('/profile', getProfile); // for getting currunt admin profile

// Complaint management routes
router.get('/complaints', getAllComplaints);
router.patch('/complaints/:id/status', updateComplaintStatus);

// User management routes
router.get('/users', manageUsers); // GET - List users 
router.patch('/users/:id', manageUsers); // PATCH - Update users

// Dashboard route
router.get('/stats', getDashboardStats);

export default router;