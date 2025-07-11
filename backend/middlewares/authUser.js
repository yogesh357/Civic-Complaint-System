 

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
            // userId:tokenDecode.id // add dwhen error occured
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
 