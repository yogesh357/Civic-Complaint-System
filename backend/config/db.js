import { PrismaClient } from '@prisma/client';
import prisma from '@prisma/client';


async function insertUser(username, email, mobileNo) {
  try {
    const res = await prisma.user.create({
      data: {
        username,
        email,
        mobileNo,

      }
    });
    console.log("✅ User created:", res);
  } catch (error) {
    console.error("❌ Error creating user:\n", error.message);
    console.error("🔍 Full error:\n", error);
  } finally {
    await prisma.$disconnect();
  }
}

insertUser("yogesh101", "yogesh101@gmail.com", "123456903",);

 