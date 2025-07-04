import jwt from 'jsonwebtoken'
 

// export const isAdmin = (req, res, next) => {
//     // Assuming user is attached to request after authentication
//     if (!req.user || (req.user.role !== 'ADMIN' && !req.user.isSuperAdmin)) {
//         return res.status(403).json({
//             success: false,
//             message: 'Forbidden: Admin privileges required'
//         });
//     }
//     next();
// };


/**
 * Authentication middleware that verifies JWT tokens and checks admin privileges
 */
export const authenticateAdmin = (req, res, next) => {
    try {
        // 1. Get token from header
        const token = req.header('Authorization')?.replace('Bearer ', '');

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token required'
            });
        }

        // 2. Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // 3. Validate token structure
        if (!decoded.userId || !decoded.role) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token structure'
            });
        }

        // 4. Check admin privileges
        const validAdminRoles = ['ADMIN', 'SUPER_ADMIN'];
        if (!validAdminRoles.includes(decoded.role)) {
            return res.status(403).json({
                success: false,
                message: 'Admin privileges required'
            });
        }

        // 5. Attach user to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role,
            isSuperAdmin: decoded.isSuperAdmin || false
        };

        next();

    } catch (error) {
        // Handle different JWT error cases
        let message = 'Authentication failed';
        if (error instanceof jwt.TokenExpiredError) {
            message = 'Token expired';
        } else if (error instanceof jwt.JsonWebTokenError) {
            message = 'Invalid token';
        }

        res.status(401).json({
            success: false,
            message
        });
    }
};


export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!req.user || !allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Requires one of these roles: ${allowedRoles.join(', ')}`
            });
        }
        next();
    };
};



export const validateRequest = (schema) => {
    return (req, res, next) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            res.status(400).json({
                success: false,
                message: 'Validation failed',
                errors: error.errors
            });
        }
    };
};