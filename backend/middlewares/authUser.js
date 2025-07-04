 

import jwt from 'jsonwebtoken'; 

const authUser = async (req, res, next) => {
    const token = req.cookies?.token || req.headers?.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ 
            success: false, 
            message: 'Authorization token required' 
        });
    }

    try {
        const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

        if (!tokenDecode.id) throw new Error('Token missing user ID');

        // Verify the token has all required fields
        if (!tokenDecode?.id) {
            return res.status(401).json({ 
                success: false, 
                message: 'Invalid token payload' 
            });
        }

        // Attach user to request
        req.user = { 
            id: tokenDecode.id, 
            userId:tokenDecode.id // adde dwhen error occured
        };
        
        next();
    } catch (error) {
        // Handle different JWT error types specifically
        let message = 'Authentication failed';
        
        if (error instanceof jwt.TokenExpiredError) {
            message = 'Token expired';
        } else if (error instanceof jwt.JsonWebTokenError) {
            message = 'Invalid token';
        }

        return res.status(401).json({ 
            success: false, 
            message,
            error: process.env.NODE_ENV === 'development' ? error.message : undefined
        });
    }
};

export default authUser;

// import jwt from 'jsonwebtoken';
// import { PrismaClient } from '@prisma/client';

// const prisma = new PrismaClient();

// const authUser = async (req, res, next) => {
//     // 1. Check for token in multiple locations (cookie, header)
//     const token = req.cookies?.token || req.headers.authorization?.split(' ')[1];
    
//     if (!token) {
//         return res.status(401).json({ 
//             success: false, 
//             message: 'Authorization token required',
//             requiredFields: ['token (cookie or Bearer token)']
//         });
//     }

//     try {
//         // 2. Verify token structure first
//         if (!token.match(/^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/)) {
//             throw new jwt.JsonWebTokenError('Malformed token');
//         }

//         // 3. Verify and decode token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET);

//         // 4. Validate required fields in payload
//         const requiredFields = ['id', 'email', 'role']; // 👈 Your required JWT claims
//         const missingFields = requiredFields.filter(field => !decoded[field]);
        
//         if (missingFields.length > 0) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'Token missing required fields',
//                 missingFields,
//                 requiredFields
//             });
//         }

//         // 5. Verify user exists in database (optional but recommended)
//         const user = await prisma.user.findUnique({
//             where: { id: decoded.id },
//             select: { id: true, email: true, role: true }
//         });

//         if (!user) {
//             return res.status(401).json({
//                 success: false,
//                 message: 'User no longer exists'
//             });
//         }

//         // 6. Attach complete user data to request
//         req.user = {
//             id: user.id,
//             email: user.email,
//             role: user.role,
//             // Add other necessary fields from user record
//         };

//         next();
//     } catch (error) {
//         // 7. Enhanced error handling
//         let message = 'Authentication failed';
//         let statusCode = 401;

//         if (error instanceof jwt.TokenExpiredError) {
//             message = 'Token expired';
//         } else if (error instanceof jwt.JsonWebTokenError) {
//             message = 'Invalid token';
//         } else if (error.name === 'PrismaClientKnownRequestError') {
//             message = 'Database error during authentication';
//             statusCode = 500;
//         }

//         return res.status(statusCode).json({
//             success: false,
//             message,
//             error: process.env.NODE_ENV === 'development' ? error.message : undefined,
//             requiredFields: ['valid JWT with id, email, role']
//         });
//     }
// };

// export default authUser;