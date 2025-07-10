
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// ================= REGISTER =================
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validation (fixed missing mobileNo issue)
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Name, email, and password are required'
            });
        }

        // Check existing user (fixed Prisma syntax)
        const existingUser = await prisma.user.findFirst({
            where: { OR: [{ name }, { email }] }
        });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: 'User already exists'
            });
        }

        // Hash password (fixed bcrypt usage)
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: { name, email, password: hashedPassword }
        });

        // YOUR ORIGINAL COOKIE CODE (unchanged)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            user: { email: user.email, name: user.name, role: user.role }
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Registration failed'
        });
    }
};

// ================= LOGIN =================
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validation (removed redundant name check)
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Email and password are required'
            });
        }

        // Find user (fixed Prisma syntax)
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

        // YOUR ORIGINAL COOKIE CODE (unchanged)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
            expiresIn: '7d'
        });

        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({
            success: true,
            user: { email: user.email, name: user.name , role:user.role}
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Login failed'
        });
    }
};

// ================= AUTH CHECK ================= 
export const isAuth = async (req, res) => {
    try {
        const user = await prisma.user.findUnique({
            where: { id: req.user.id },
            select: { id: true, email: true, name: true, complaints: true,role:true }
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.json({ success: true, user });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Authentication check failed'
        });
    }
};

// ================= LOGOUT =================
export const logout = (req, res) => {
    try {
        // YOUR ORIGINAL COOKIE CLEARING CODE (unchanged)
        res.clearCookie('token', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
        });

        return res.json({ success: true, message: 'Logged out' });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            success: false,
            message: 'Logout failed'
        });
    }
};