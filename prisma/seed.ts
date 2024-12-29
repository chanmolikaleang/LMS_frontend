import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { Gender, Role } from 'src/user/entities/user.entity';
const chalk = require('chalk');
const p = require('cli-progress');

const prisma = new PrismaClient();

async function hashData(data: string) {
  return await bcrypt.hash(data, 10);
}

async function seed() {
  const hashedPassword = await hashData('12345678');

  // Delete data from tables
  console.log(chalk.red('Deleting existing data...'));
  await prisma.user.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.subject.deleteMany();
  await prisma.classroom.deleteMany();
  console.log(chalk.green('Existing data deleted.'));

  const progressBar = new p.SingleBar({}, p.Presets.shades_classic);
  progressBar.start(1, 0);

  // Create default user
  console.log(chalk.blue('Creating default user...'));
  const defaultUser = {
    username: 'Admin',
    firstName: 'Admin',
    lastName: 'User',
    hashed: hashedPassword,
    email: 'admin@gmail.com',
    dateOfBirth: `${new Date()}`,
    gender: Gender.Male,
    role: Role.Admin,
  };

  await prisma.user.create({ data: defaultUser });
  console.log(chalk.green('Default user created.'));

  progressBar.update(1);
  progressBar.stop();
}

seed()
  .catch((error) => {
    console.error(chalk.red(error));
  })
  .finally(async () => {
    await prisma.$disconnect();
    console.log(chalk.green('Seeding completed.'));
  });
