import { z } from 'zod';

export const adminRegistrationSchema = z.object({
    name: z.string()
        .min(2, "Name must be at least 2 characters")
        .max(50, "Name cannot exceed 50 characters"),

    email: z.string()
        .email("Invalid email format")
        .max(100, "Email cannot exceed 100 characters"),

    password: z.string()
        .min(8, "Password must be at least 8 characters")
        .regex(/[A-Z]/, "Must contain at least one uppercase letter")
        .regex(/[a-z]/, "Must contain at least one lowercase letter")
        .regex(/[0-9]/, "Must contain at least one number")
        .regex(/[^A-Za-z0-9]/, "Must contain at least one special character"),
 
    department: z.string()
        .max(50, "Department cannot exceed 50 characters")
        .optional()
}).strict();  