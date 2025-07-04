import { z } from 'zod';

export const adminRegistrationSchema = z.object({
    name: z.string().min(2).max(50),
    email: z.string().email(),
    password: z.string().min(8).regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        'Password must contain at least one uppercase, one lowercase, one number and one special character'
    ),
    role: z.enum(['ADMIN', 'STAFF_ADMIN']),
    department: z.string().optional()
});