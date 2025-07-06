// import { body } from 'express-validator';

// export const validateComplaint = [
//     body('title')
//         .trim()
//         .notEmpty()
//         .withMessage('Title is required')
//         .isLength({ max: 100 })
//         .withMessage('Title must be less than 100 characters'),

//     body('description')
//         .trim()
//         .notEmpty()
//         .withMessage('Description is required')
//         .isLength({ max: 1000 })
//         .withMessage('Description must be less than 1000 characters'),

//     body('location')
//         .trim()
//         .notEmpty()
//         .withMessage('Location is required'),

//     body('category')
//         .trim()
//         .notEmpty()
//         .withMessage('Category is required')
//         .isIn(['Infrastructure', 'Sanitation', 'Security', 'Other'])
//         .withMessage('Invalid category'),

//     body('status')
//         .optional()
//         .isIn(['Pending', 'In Progress', 'Resolved', 'Rejected'])
//         .withMessage('Invalid status'),
// ];
import { body } from 'express-validator';
import { Category, Status } from '@prisma/client';

export const validateComplaint = [
    // Title validation
    body('title')
        .trim()
        .notEmpty().withMessage('Title is required')
        .isLength({ min: 5, max: 100 }).withMessage('Title must be 5-100 characters')
        .escape(),

    // Description validation
    body('description')
        .trim()
        .notEmpty().withMessage('Description is required')
        .isLength({ min: 10, max: 1000 }).withMessage('Description must be 10-1000 characters')
        .escape(),

    // Category validation (using Prisma enum)
    body('category')
        .trim()
        .notEmpty().withMessage('Category is required')
        .isIn(Object.values(Category)).withMessage(`Invalid category. Valid options: ${Object.values(Category).join(', ')}`)
        .toUpperCase(),

    // Address validation (matches your form structure)
    body('address.street')
        .notEmpty().withMessage('Street is required')
        .isLength({ max: 100 }).withMessage('Street must be less than 100 characters')
        .escape(),

    body('address.area')
        .notEmpty().withMessage('Area is required')
        .isLength({ max: 100 }).withMessage('Area must be less than 100 characters')
        .escape(),

    body('address.city')
        .notEmpty().withMessage('City is required')
        .isLength({ max: 50 }).withMessage('City must be less than 50 characters')
        .escape(),

    body('address.pincode')
        .notEmpty().withMessage('Pincode is required')
        .isPostalCode('IN').withMessage('Invalid Indian pincode format')
        .escape(),

    // Optional landmark
    body('address.landmark')
        .optional()
        .isLength({ max: 100 }).withMessage('Landmark must be less than 100 characters')
        .escape(),

    // Image validation
    body('image')
        .optional()
        .custom((value, { req }) => {
            if (req.file) {
                // Validate file type
                const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
                if (!validTypes.includes(req.file.mimetype)) {
                    throw new Error('Only JPEG, PNG, and WebP images are allowed');
                }
                // Validate file size (5MB max)
                if (req.file.size > 5 * 1024 * 1024) {
                    throw new Error('Image size must be less than 5MB');
                }
            }
            return true;
        }),

    // User ID validation
    body('userId')
        .notEmpty().withMessage('User ID is required')
        .isInt({ min: 1 }).withMessage('User ID must be a positive integer')
];