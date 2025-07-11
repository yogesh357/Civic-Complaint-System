import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ValidationError, ForbiddenError } from '../errors/index.js';

// Admin Login
export const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find admin user
        const admin = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
                isActive: true
            }
        });

        // Validate admin
        if (!admin || admin.role !== 'ADMIN') {
            throw new ValidationError('Invalid admin credentials');
        }

        if (!admin.isActive) {
            throw new ForbiddenError('Admin account is deactivated');
        }

        // Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            throw new ValidationError('Invalid credentials');
        }

        // Generate JWT
        const token = jwt.sign(
            {
                userId: admin.id,
                role: admin.role
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );


        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Return response (excluding password)
        const { password: _, ...adminData } = admin;
        res.json({
            success: true,
            token,
            data: adminData
        });

    } catch (error) {
        next(error);
    }
};

// Admin Registration (Only for initial setup)
export const createFirstAdmin = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;

        // Check if any admin exists
        const existingAdmin = await prisma.user.findFirst({
            where: { role: 'ADMIN' }
        });

        if (existingAdmin) {
            throw new ForbiddenError('Admin already exists');
        }

        // Create first admin
        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        // Generate token
        const token = jwt.sign(
            {
                userId: admin.id,
                role: admin.role,

            },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        )

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        res.status(201).json({
            success: true,
            message: 'Initial admin created successfully',
            data: admin
        });
    } catch (error) {
        next(error);
    }
};

// register admin 
export const register = async (req, res, next) => {
    try {
        const { name, email, password } = req.body;
        // 1. Input validation
        if (!name || !email || !password) {
            throw new ValidationError('Name, email, and password are required');
        }

        // 2. Check if email exists
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new ValidationError('Email already registered');
        }

        // 3. Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create admin
        const newAdmin = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role: 'ADMIN',
                isActive: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                createdAt: true
            }
        });

        // 5. Generate token (NEW)
        const token = jwt.sign(
            { userId: newAdmin.id, role: newAdmin.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // 6. Set HTTP-only cookie (NEW)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            path: '/'
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered and logged in successfully',
            data: newAdmin
        });

    } catch (error) {
        next(error);
    }
};

export const logoutAdmin = (req, res) => {
    try {
        // YOUR ORIGINAL COOKIE CLEARING CODE (unchanged)
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: 'Logged out' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};
// Get current admin profile
export const getProfile = async (req, res, next) => {
    try {
        const admin = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isActive: true,
                createdAt: true
            }
        });


        if (!admin || admin.role !== 'ADMIN') {
            throw new ForbiddenError('Admin not found');
        }



        res.json({ success: true, data: admin });
    } catch (error) {
        next(error);
    }
};

// Get all complaints with filtering
export const getAllComplaints = async (req, res, next) => {
    try {
        const { status, category, userId, fromDate, toDate } = req.query;

        const complaints = await prisma.complaint.findMany({
            where: {
                status: status || undefined,
                category: category || undefined,
                userId: userId ? parseInt(userId) : undefined,
                createdAt: {
                    gte: fromDate ? new Date(fromDate) : undefined,
                    lte: toDate ? new Date(toDate) : undefined
                }
            },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            },
            orderBy: { createdAt: 'desc' }
        });

        res.json({ success: true, data: complaints });
    } catch (error) {
        next(error);
    }
};

// Update complaint status
export const updateComplaintStatus = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatus = ['PENDING', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];
        if (!validStatus.includes(status)) {
            throw new ValidationError('Invalid status value');
        }

        const complaint = await prisma.complaint.update({
            where: { id: parseInt(id) },
            data: { status }
        });

        res.json({ success: true, data: complaint });
    } catch (error) {
        next(error);
    }
};

// get complaint with id
export const getComplaintById = async (req, res, next) => {
    try {

        const complaintId = typeof req.params.id === 'string'
            ? parseInt(req.params.id, 10)
            : NaN;

        if (isNaN(complaintId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID format - must be a number"
            });
        }

        const complaint = await prisma.complaint.findUnique({
            where: { id: complaintId },
            include: {
                user: {
                    select: { name: true, email: true }
                }
            } 

        });

        if (!complaint) {
            return res.status(404).json({ success: false, message: 'Complaint not found' });
        }

        res.json({ success: true, data: complaint });
    } catch (error) {
        next(error);
    }
};


// User management
export const manageUsers = async (req, res, next) => {
    try {
        // GET - List users (non-admins only)
        if (req.method === 'GET') {
            const users = await prisma.user.findMany({
                where: { role: 'USER' },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    isActive: true,
                    createdAt: true
                }
            });
            return res.json({ success: true, data: users });
        }

        // PATCH - Update users
        if (req.method === 'PATCH') {
            const { id } = req.params;
            const { isActive } = req.body;

            const updatedUser = await prisma.user.update({
                where: { id: parseInt(id), role: 'USER' },
                data: { isActive }
            });

            return res.json({ success: true, data: updatedUser });
        }

    } catch (error) {
        next(error);
    }
};

// Admin dashboard statistics
export const getDashboardStats = async (req, res, next) => {
    try {
        const [totalComplaints, resolvedComplaints, usersCount] = await Promise.all([
            prisma.complaint.count(),
            prisma.complaint.count({ where: { status: 'RESOLVED' } }),
            prisma.user.count({ where: { role: 'USER' } })
        ]);

        res.json({
            success: true,
            data: {
                totalComplaints,
                resolvedComplaints,
                resolutionRate: totalComplaints > 0
                    ? (resolvedComplaints / totalComplaints * 100).toFixed(2)
                    : 0,
                usersCount
            }
        });
    } catch (error) {
        next(error);
    }
};
