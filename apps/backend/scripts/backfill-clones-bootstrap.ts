import { NestFactory } from '@nestjs/core';
import { AppModule } from '../src/app.module';
import { PrismaService } from '../src/prisma/prisma.service';

async function main() {
  const app = await NestFactory.createApplicationContext(AppModule, {
    logger: ['log', 'error', 'warn'],
  });

  const prisma = app.get(PrismaService);

  try {
    console.log('Looking for users without clones...');

    const users = await prisma.user.findMany();
    let created = 0;

    for (const u of users) {
      const existing = await prisma.clone.findUnique({ where: { userId: u.id } });
      if (!existing) {
        console.log(`Creating clone for user ${u.id} (${u.username})`);
        const clone = await prisma.clone.create({
          data: {
            userId: u.id,
            name: `${u.username}'s Clone`,
            personalityProgress: 0,
            intelligenceScore: 50,
            level: 1,
            accuracyPercent: 50,
            mood: 'curious',
            isOnline: false,
            trainingCount: 0,
          },
        });

        const defaultTraits = ['Humor', 'Empathy', 'Creativity', 'Logic', 'Curiosity'];

        for (const t of defaultTraits) {
          await prisma.traitScore.create({
            data: {
              cloneId: clone.id,
              name: t,
              value: 50,
            },
          });
        }

        created += 1;
      }
    }

    console.log(`Done. Created ${created} clones.`);
  } catch (err) {
    console.error('Error during backfill:', err);
    process.exitCode = 1;
  } finally {
    await app.close();
  }
}

main();
