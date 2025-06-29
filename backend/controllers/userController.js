
// import { PrismaClient } from '@prisma/client';
// import prisma from '@prisma/client';
// import jwt from 'jsonwebtoken'
// import bcrypt from 'bcryptjs';

// export const register = async (req, res) => {
//     try {
//         const { username, email,  password } = req.body
//         if (!username || !email || !mobileNo || !password) {
//             return res.json({ success: false, message: 'Missing user Details' })
//         }
//         const existingUser = await prisma.user.findFirst({ username })

//         if (existingUser) {
//             return res.json({ success: false, message: 'User already exist' })
//         }
//         const hashedPassword = bcrypt.encodeBase64(password)
//         const user = await prisma.user.create({
//             data: {
//                 username,
//                 email, 
//                 password: hashedPassword
//             }
//         })
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//         res.cookie('token', token, {
//             httpOnly: true, //Prevent JawaScript to access cookie
//             secure: process.env.NODE_ENV === 'production', //Use secure cookies in production
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', //CSRF protection
//             maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie expiration time
//         })

//         return res.json({ success: true, user: { email: user.email, username: user.username } })


//     } catch (error) {
//         console.log(error.message);
//         res.json({ success: false, message: error.message })
//     }
// }

// export const login = async (req, res) => {
//     try {
//         const { username, email, password } = req.body

//         if (!email || !password || !username) {
//             return res.json({ success: false, message: "Fill the required details" })
//         }
//         const user = await prisma.user.findFirst({ username });

//         if (!user) {
//             return res.json({ success: false, message: "Invalid Login Details" })
//         }
//         const isMatch = await bcrypt.compare(password, user.password)

//         if (!isMatch) {
//             return res.json({ success: false, message: "Invalid email or password" })
//         }

//         const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '7d' });

//         res.cookie('token', token, {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//             maxAge: 7 * 24 * 60 * 60 * 1000,
//         })

//         return res.json({ success: true, user: { email: user.email, name: user.name } })


//     } catch (error) {
//         console.log(error.message);
//         res.json({ success: false, message: error.message })
//     }

// }

// export const isAuth = async (req, res) => {
//     try {
//         const { id: userId } = req.user;
//         const user = await prisma.user.findFirst(userId).select("-password");

//         if (!user) {
//             return res.json({ success: false, message: "User not found" });
//         }

//         return res.json({ success: true, user });
//     } catch (error) {
//         console.log(error.message);
//         res.json({ success: false, message: error.message });
//     }

// }

// export const logout = async (req, res) => {
//     try {
//         res.clearCookie('token', {
//             httpOnly: true,
//             secure: process.env.NODE_ENV === 'production',
//             sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
//         });
//         return res.json({ success: true, message: "Logged Out" })
//     } catch (error) {
//         console.log(error.message)
//         res.json({ success: false, message: error.message })
//     }
// }

import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Initialize Prisma Client (FIXED: Your original had duplicate imports)
const prisma = new PrismaClient();

// --- REGISTER ---
export const register = async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Validation (FIXED: Removed undefined 'mobileNo')
        if (!username || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Username, email, and password are required'
            });
        }

        // Check existing user (FIXED: Correct Prisma syntax)
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ username }, { email }] }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'Username or email already exists'
            });
        }

        // Hash password (FIXED: bcrypt.hash() instead of encodeBase64)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: { username, email, password: hashedPassword }
        });

        // Generate JWT (FIXED: Use user.id, not _id)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        // Set cookie (correct as-is)
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(201).json({
            success: true,
            user: { id: user.id, email: user.email, username: user.username }
        });

    } catch (error) {
        console.error('Registration error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// --- LOGIN ---
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user (FIXED: findUnique + where)
        const user = await prisma.user.findUnique({
            where: { email }
        });

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Generate JWT and set cookie (same as register)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.status(200).json({
            success: true,
            user: { id: user.id, email: user.email, username: user.username }
        });

    } catch (error) {
        console.error('Login error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// --- AUTH CHECK ---
export const isAuth = async (req, res) => {
    try {
        if (!req.user?.id) {
            return res.status(401).json({
                success: false,
                message: 'Not authenticated'
            });
        }

        // Fetch user (FIXED: Correct select syntax)
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, username: true }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({ success: true, user });

    } catch (error) {
        console.error('Auth check error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};

// --- LOGOUT ---
export const logout = (req, res) => {
    try {
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });
        return res.status(200).json({
            success: true,
            message: 'Logged out successfully'
        });
    } catch (error) {
        console.error('Logout error:', error);
        return res.status(500).json({
            success: false,
            message: 'Internal server error'
        });
    }
};