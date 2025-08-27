import { Module } from '@nestjs/common';
import { CarService } from './carros.service';
import { CarController } from './carros.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  providers: [CarService],
  controllers: [CarController],
  imports: [PrismaModule]
})
export class CarrosModule {}
