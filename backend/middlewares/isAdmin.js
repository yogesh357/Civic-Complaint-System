export const isAdmin = (req, res, next) => {
    // Assuming user is attached to request after authentication
    if (!req.user || (req.user.role !== 'ADMIN' && !req.user.isSuperAdmin)) {
        return res.status(403).json({
            success: false,
            message: 'Forbidden: Admin privileges required'
        });
    }
    next();
};