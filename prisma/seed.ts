import { generateUUID } from '../src/@core/utils/uuidGen';
import { PrismaClient, User } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

const SEED_EMAIL = process.env.PRISMA_SEED_ADMIN_EMAIL;
const SEED_PASSWORD = process.env.PRISMA_SEED_ADMIN_PASSWORD;
const SECURITY_SALTS = process.env.SECURITY_SALTS;

const userId = generateUUID();
const clientId = generateUUID();

const adminClient = {
  id: clientId,
  name: 'Admin',
  email: SEED_EMAIL,
  phone: '00000000000',
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

const adminUser: User = {
  id: userId,
  username: 'admin',
  fullName: 'Admin',
  email: SEED_EMAIL,
  cpf: '00000000000',
  phone: '00000000000',
  password: bcrypt.hashSync(SEED_PASSWORD, parseInt(SECURITY_SALTS)),
  clientId: clientId,
  createdAt: new Date(),
  updatedAt: new Date(),
  deletedAt: null,
};

async function seedClient() {
  let client = await prisma.client.findFirst({
    where: {
      email: adminClient.email,
    },
  });

  if (!client) {
    client = await prisma.client.create({
      data: adminClient,
    });
  }

  return client;
}

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
  await seedClient();
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
