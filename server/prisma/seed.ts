import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const login = process.env.ADMIN_LOGIN || 'admin';
  const password = process.env.ADMIN_PASSWORD || 'admin';
  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { login },
    update: {},
    create: { login, passwordHash, role: 'admin' },
  });

  console.log(`Seed: администратор "${login}" готов.`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
