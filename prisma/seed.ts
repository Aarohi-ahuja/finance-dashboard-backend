import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding...');

  // Create an admin user
  const adminPassword = await bcrypt.hash('admin123', 10);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@finance.local' },
    update: {},
    create: {
      email: 'admin@finance.local',
      name: 'Admin User',
      password: adminPassword,
      role: 'ADMIN',
    },
  });

  // Create an analyst
  const analystPassword = await bcrypt.hash('analyst123', 10);
  const analyst = await prisma.user.upsert({
    where: { email: 'analyst@finance.local' },
    update: {},
    create: {
      email: 'analyst@finance.local',
      name: 'Analyst User',
      password: analystPassword,
      role: 'ANALYST',
    },
  });

  // Create a viewer
  const viewerPassword = await bcrypt.hash('viewer123', 10);
  const viewer = await prisma.user.upsert({
    where: { email: 'viewer@finance.local' },
    update: {},
    create: {
      email: 'viewer@finance.local',
      name: 'Viewer User',
      password: viewerPassword,
      role: 'VIEWER',
    },
  });

  // Create records
  await prisma.record.create({
    data: {
      amount: 5000,
      type: 'INCOME',
      category: 'Sales',
      description: 'Initial software sale',
      date: new Date(),
      createdById: admin.id,
      updatedById: admin.id
    }
  });

  await prisma.record.create({
    data: {
      amount: 1500,
      type: 'EXPENSE',
      category: 'Marketing',
      description: 'Ads campaign',
      date: new Date(),
      createdById: admin.id,
      updatedById: admin.id
    }
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
