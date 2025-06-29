import { body } from 'express-validator';

export const validateComplaint = [
    body('title')
        .trim()
        .notEmpty()
        .withMessage('Title is required')
        .isLength({ max: 100 })
        .withMessage('Title must be less than 100 characters'),

    body('description')
        .trim()
        .notEmpty()
        .withMessage('Description is required')
        .isLength({ max: 1000 })
        .withMessage('Description must be less than 1000 characters'),

    body('location')
        .trim()
        .notEmpty()
        .withMessage('Location is required'),

    body('category')
        .trim()
        .notEmpty()
        .withMessage('Category is required')
        .isIn(['Infrastructure', 'Sanitation', 'Security', 'Other'])
        .withMessage('Invalid category'),

    body('status')
        .optional()
        .isIn(['Pending', 'In Progress', 'Resolved', 'Rejected'])
        .withMessage('Invalid status'),
];