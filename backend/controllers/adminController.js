import prisma from '../config/prisma.js';
import { ForbiddenError } from '../errors/index.js';

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