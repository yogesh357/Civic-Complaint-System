import prisma from '../config/prisma.js';
import bcrypt from 'bcryptjs';

const seedSuperAdmin = async () => {
    const email = 'superadmin@example.com';
    const existingAdmin = await prisma.user.findUnique({ where: { email } });

    if (!existingAdmin) {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash('SecurePassword123!', salt);

        await prisma.user.create({
            data: {
                name: 'Super Admin',
                email,
                password: hashedPassword,
                role: 'SUPER_ADMIN',
                isSuperAdmin: true,
                isActive: true
            }
        });

        console.log('Super admin created successfully');
    } else {
        console.log('Super admin already exists');
    }
};

seedSuperAdmin()
    .catch(e => {
        console.error('Error seeding super admin:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });