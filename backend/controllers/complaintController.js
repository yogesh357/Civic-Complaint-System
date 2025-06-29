import prisma from '../config/prisma.js';
import cloudinary from '../config/cloudinary.js';
import { NotFoundError, ForbiddenError } from '../errors/index.js';

// Create a new complaint
export const addComplaint = async (req, res) => {
    try {
        const { title, description, location, category } = req.body;
        const { userId } = req.user;

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
                location,
                imageUrl,
                status: 'Pending',
                category,
                userId,
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
            }
        });

        res.status(201).json({
            success: true,
            data: complaint,
        });
    } catch (error) {
        next(error);
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
        const { id } = req.params;
        const { userId } = req.user;

        const complaint = await prisma.complaint.findUnique({
            where: { id },
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

        res.status(200).json({
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
        const { id } = req.params;
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
        const { id } = req.params;
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