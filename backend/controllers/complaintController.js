import prisma from '../config/prisma.js';
import cloudinary from '../config/cloudinary.js';
import { NotFoundError, ForbiddenError } from '../errors/index.js';
import { Category } from '@prisma/client';

// Create a new complaint
export const addComplaint = async (req, res, next) => {
    try {
        const { title, description, address, category } = req.body;
        const userId = req.user?.id || req.user?.userId;

        const validCategories = Object.values(Category);
        if (!category || !validCategories.includes(category)) {
            return res.status(400).json({
                error: `Invalid category. Must be one of: ${validCategories.join(', ')}`,
            });
        }
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: "User authentication invalid"
            });
        }
        // const locationString = `${address.street}, ${address.area}, ${address.city}, ${address.pincode}`;
        // 1. Add address validation
        if (!address || typeof address !== 'object') {
            return res.status(400).json({
                success: false,
                message: "Address data is required"
            });
        }

        // 2. Validate address components
        const requiredAddressFields = ['street', 'city', 'pincode'];
        const missingFields = requiredAddressFields.filter(field => !address[field]);

        if (missingFields.length > 0) {
            return res.status(400).json({
                success: false,
                message: `Missing address fields: ${missingFields.join(', ')}`
            });
        }

        // 3. Safely construct location string
        const locationString = [
            address.street || '',
            address.area || '',
            address.city || '',
            address.pincode || ''
        ].filter(Boolean).join(', ');  



        let imageUrl = null;
        if (req.file) {
            const result = await cloudinary.uploader.upload(req.file.path, {
                folder: 'complaints',
            });
            imageUrl = result.secure_url;
        }

        const complaint = await prisma.complaint.create({
            data: {
                title,
                description,
                location: locationString,
                imageUrl,
                status: 'PENDING',
                category,
                userId: Number(userId)
                // user: {
                //     connect: {
                //         id: Number(userId) // Relation connection
                //     }
                // }
            },
            select: {
                id: true,
                title: true,
                description: true,
                location: true,
                status: true,
                category: true,
                imageUrl: true,
                createdAt: true
            }
        });

        console.log("submited complent", complaint)
        return res.status(201).json({
            success: true,
            data: complaint
        });

    } catch (error) {
        if (error.code === 'P2025') {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        console.error('Complaint creation error:', error);
        return res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
};

// Get all complaints for the authenticated user
export const getUserComplaints = async (req, res, next) => {
    try {
        const { userId } = req.user;

        const complaints = await prisma.complaint.findMany({
            where: { userId },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                category: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
            },
            orderBy: {
                createdAt: 'desc',
            },
        });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints,
        });
    } catch (error) {
        next(error);
    }
};


// Get single complaint details

export const getComplaintDetails = async (req, res, next) => {
    try {
        // 1. Safely extract and validate the complaint ID
        const complaintId = typeof req.params.id === 'string'
            ? parseInt(req.params.id, 10)
            : NaN;

        if (isNaN(complaintId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID format - must be a number"
            });
        }

        // 2. Get authenticated user ID
        const userId = req.user?.id || req.user?.userId;

        console.log("user id when complaint details : ", userId)
        console.log("complaint id :", complaintId)
        // 3. Fetch the complaint - FIXED: Using complaintId instead of id
        const complaint = await prisma.complaint.findUnique({
            where: {
                id: complaintId
            },
            select: {
                id: true,
                title: true,
                description: true,
                location: true,
                status: true,
                category: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
            },
        });

        if (!complaint) {
            throw new NotFoundError('Complaint not found');
        }

        if (complaint.userId !== userId) {
            throw new ForbiddenError('Not authorized to access this complaint');
        }

        return res.status(200).json({
            success: true,
            data: complaint,
        });

    } catch (error) {
        next(error);
    }
};

// Update a complaint
export const updateComplaint = async (req, res, next) => {
    try {
        const id = typeof req.params.id === 'string'
            ? parseInt(req.params.id, 10)
            : NaN;

        if (isNaN(id)) {
            return res.status(400).json({
                success: false,
                message: "Invalid complaint ID format - must be a number"
            });
        }

        const { userId } = req.user;
        const { title, description, location, status, category } = req.body;

        // Check if complaint exists and belongs to user
        const existingComplaint = await prisma.complaint.findUnique({
            where: { id },
        });

        if (!existingComplaint) {
            throw new NotFoundError('Complaint not found');
        }

        if (existingComplaint.userId !== userId) {
            throw new ForbiddenError('Not authorized to update this complaint');
        }

        const updatedComplaint = await prisma.complaint.update({
            where: { id },
            data: {
                title,
                description,
                location,
                status,
                category,
            },
            select: {
                id: true,
                title: true,
                description: true,
                location: true,
                status: true,
                category: true,
                imageUrl: true,
                createdAt: true,
                updatedAt: true,
            },
        });

        res.status(200).json({
            success: true,
            data: updatedComplaint,
        });
    } catch (error) {
        next(error);
    }
};

// Delete a complaint
export const deleteComplaint = async (req, res, next) => {
    try {
        const id = typeof req.params.id === 'string'
            ? parseInt(req.params.id, 10)
            : NaN;

        const { userId } = req.user;

        // Check if complaint exists and belongs to user
        const existingComplaint = await prisma.complaint.findUnique({
            where: { id },
        });

        if (!existingComplaint) {
            throw new NotFoundError('Complaint not found');
        }

        if (existingComplaint.userId !== userId) {
            throw new ForbiddenError('Not authorized to delete this complaint');
        }

        // Delete image from Cloudinary if exists
        if (existingComplaint.imageUrl) {
            const publicId = existingComplaint.imageUrl.split('/').pop().split('.')[0];
            await cloudinary.uploader.destroy(`complaints/${publicId}`);
        }

        await prisma.complaint.delete({
            where: { id },
        });

        res.status(200).json({
            success: true,
            data: {},
        });
    } catch (error) {
        next(error);
    }
};