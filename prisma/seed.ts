import { generateUUID } from '../src/@core/utils/uuidGen';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SEED_EMAIL = process.env.PRISMA_SEED_ADMIN_EMAIL;
const SEED_PASSWORD = process.env.PRISMA_SEED_ADMIN_PASSWORD;
const SECURITY_SALTS = process.env.SECURITY_SALTS;

const adminUser: User = {
  id: generateUUID(),
  username: 'admin',
  fullName: 'Admin',
  cpf: '00000000000',
  phone: '00000000000',
  email: SEED_EMAIL,
  password: bcrypt.hashSync(SEED_PASSWORD, parseInt(SECURITY_SALTS)),
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

async function seedUser() {
  let user = await prisma.user.findFirst({
    where: {
      email: adminUser.email,
    },
  });

  if (!user) {
    user = await prisma.user.create({
      data: adminUser,
    });
  }

  return user;
}

async function main() {
  await seedUser();
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
