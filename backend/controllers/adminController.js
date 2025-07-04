import prisma from '../config/prisma.js';
import { ForbiddenError } from '../errors/index.js';

import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ValidationError, ForbiddenError } from '../errors/index.js';

// Admin Login
export const loginAdmin = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // 1. Find admin user
        const admin = await prisma.user.findUnique({
            where: { email },
            select: {
                id: true,
                name: true,
                email: true,
                password: true,
                role: true,
                department: true,
                permissions: true,
                isSuperAdmin: true,
                isActive: true
            }
        });

        // 2. Validate admin
        if (!admin || !['ADMIN', 'SUPER_ADMIN'].includes(admin.role)) {
            throw new ValidationError('Invalid admin credentials');
        }

        if (!admin.isActive) {
            throw new ForbiddenError('Admin account is deactivated');
        }

        // 3. Verify password
        const isMatch = await bcrypt.compare(password, admin.password);
        if (!isMatch) {
            throw new ValidationError('Invalid credentials');
        }

        // 4. Generate JWT
        const token = jwt.sign(
            {
                userId: admin.id,
                role: admin.role,
                department: admin.department,
                permissions: admin.permissions,
                isSuperAdmin: admin.isSuperAdmin
            },
            process.env.JWT_SECRET,
            { expiresIn: '8h' }
        );

        // 5. Return response (excluding password)
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

// Admin Registration (Super Admin only)
export const registerAdmin = async (req, res, next) => {
    try {
        const { name, email, password, role, department, permissions } = req.body;

        // 1. Authorization check
        if (!req.user.isSuperAdmin) {
            throw new ForbiddenError('Only super admins can register new admins');
        }

        // 2. Validate role
        const validRoles = ['ADMIN', 'STAFF_ADMIN'];
        if (!validRoles.includes(role)) {
            throw new ValidationError(`Invalid role. Allowed: ${validRoles.join(', ')}`);
        }

        // 3. Check email exists
        const exists = await prisma.user.findUnique({ where: { email } });
        if (exists) {
            throw new ValidationError('Email already registered');
        }

        // 4. Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 5. Create admin
        const newAdmin = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
                role,
                department,
                permissions: permissions || [],
                isSuperAdmin: false, // Can only be set manually in DB
                isActive: true
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                permissions: true,
                createdAt: true
            }
        });

        res.status(201).json({
            success: true,
            message: 'Admin registered successfully',
            data: newAdmin
        });

    } catch (error) {
        next(error);
    }
};

// Get current admin profile
export const getAdminProfile = async (req, res, next) => {
    try {
        const admin = await prisma.user.findUnique({
            where: { id: req.user.userId },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                permissions: true,
                isSuperAdmin: true,
                createdAt: true
            }
        });

        if (!admin) {
            throw new ForbiddenError('Admin not found');
        }

        res.json({
            success: true,
            data: admin
        });

    } catch (error) {
        next(error);
    }
};
// Get current admin profile
export const getProfile = async (req, res, next) => {
    try {
        // req.user should be set by your auth middleware
        const admin = await prisma.user.findUnique({
            where: {
                id: req.user.userId,
                role: { in: ['ADMIN', 'SUPER_ADMIN'] }
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                department: true,
                isActive: true,
                isSuperAdmin: true,
                createdAt: true
            }
        });

        if (!admin) {
            throw new ForbiddenError('Admin not found');
        }

        res.json({ success: true, data: admin });
    } catch (error) {
        next(error);
    }
};


// Get all complaints with advanced filtering
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

// Update complaint status (admin only)
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

// User management (list/create/update)
export const manageUsers = async (req, res, next) => {
    try {
        // GET - List users
        if (req.method === 'GET') {
            const { role, active } = req.query;

            const users = await prisma.user.findMany({
                where: {
                    role: role || undefined,
                    isActive: active ? active === 'true' : undefined
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    role: true,
                    department: true,
                    isActive: true,
                    createdAt: true
                }
            });

            return res.json({ success: true, data: users });
        }

        // POST - Create staff accounts
        if (req.method === 'POST') {
            const { name, email, password, department } = req.body;

            // Only super admins can create staff
            if (!req.user.isSuperAdmin) {
                throw new ForbiddenError('Only super admins can create staff');
            }

            const staff = await prisma.user.create({
                data: {
                    name,
                    email,
                    password, // Should be hashed in real implementation
                    role: 'STAFF',
                    department
                }
            });

            return res.status(201).json({ success: true, data: staff });
        }

        // PATCH - Update users
        if (req.method === 'PATCH') {
            const { id } = req.params;
            const { role, isActive, department } = req.body;

            // Prevent modifying super admins unless you're a super admin
            const targetUser = await prisma.user.findUnique({
                where: { id: parseInt(id) }
            });

            if (targetUser.isSuperAdmin && !req.user.isSuperAdmin) {
                throw new ForbiddenError('Cannot modify super admin');
            }

            const updatedUser = await prisma.user.update({
                where: { id: parseInt(id) },
                data: { role, isActive, department }
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
            prisma.user.count()
        ]);

        res.json({
            success: true,
            data: {
                totalComplaints,
                resolvedComplaints,
                resolutionRate: (resolvedComplaints / totalComplaints * 100).toFixed(2),
                usersCount
            }
        });
    } catch (error) {
        next(error);
    }
};