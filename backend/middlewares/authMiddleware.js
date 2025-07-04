import jwt from 'jsonwebtoken';

/**
 * Authentication middleware for admin routes
 */export const authenticateAdmin = (req, res, next) => {
    try {
        // 1. Get token from either cookies or Authorization header
        const token = req.cookies?.token ||
            req.headers?.authorization?.split(' ')[1];

        if (!token) {
            return res.status(401).json({
                success: false,
                message: 'Authorization token required'
            });
        }

        // 2. Verify token
        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            // Handle specific JWT errors
            if (err instanceof jwt.TokenExpiredError) {
                return res.status(401).json({
                    success: false,
                    message: 'Token expired'
                });
            }
            if (err instanceof jwt.JsonWebTokenError) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token'
                });
            }
            throw err;
        }

        // 3. Validate token structure
        if (!decoded?.userId || !decoded?.role) {
            return res.status(401).json({
                success: false,
                message: 'Token missing required fields'
            });
        }

        // 4. Check admin privileges
        if (decoded.role !== 'ADMIN') {
            return res.status(403).json({
                success: false,
                message: 'Admin privileges required'
            });
        }

        // 5. Attach user to request
        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();

    } catch (error) {
        console.error('Authentication error:', error);
        res.status(500).json({
            success: false,
            message: 'Internal server error during authentication'
        });
    }
};

/**
 * Role checker middleware (simplified for ADMIN/USER only)
 */
export const checkRole = (allowedRoles) => {
    return (req, res, next) => {
        if (!allowedRoles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: `Forbidden: Requires role: ${allowedRoles.join(' or ')}`
            });
        }
        next();
    };
};

/**
 * Request validation middleware (unchanged)
 */
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