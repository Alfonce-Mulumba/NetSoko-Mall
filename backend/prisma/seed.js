import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const hashedPassword = await bcrypt.hash('Admin123', 10);

  const admin = await prisma.user.create({
    data: {
      name: 'NetSoko Admin',
      email: 'netsoko.care@gmail.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  console.log('✅ Admin user created:', admin.email);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
