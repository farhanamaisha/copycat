import { PrismaClient } from '@prisma/client';

async function main() {
  const email = process.argv[2];
  if (!email) {
    console.error('Usage: ts-node scripts/find-pending-token.ts <email>');
    process.exit(2);
  }

  const prisma = new PrismaClient();
  try {
    const pending = await prisma.pendingUser.findFirst({ where: { email } });
    if (!pending) {
      console.error('No pending user found for', email);
      process.exit(1);
    }
    console.log((pending as any).token ?? 'no-token-field');
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
