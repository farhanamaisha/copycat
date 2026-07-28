import { Module } from '@nestjs/common';
import { ClonesService } from './clones.service';
import { ClonesController } from './clones.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ClonesService],
  controllers: [ClonesController],
  exports: [ClonesService],
})
export class ClonesModule {}
