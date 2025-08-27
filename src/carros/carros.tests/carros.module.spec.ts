import { Test, TestingModule } from '@nestjs/testing';
import { CarrosModule } from '../carros.module';
import { CarService } from '../carros.service';
import { CarController } from '../carros.controller';
import { PrismaService } from '../../prisma/prisma.service';

describe('CarrosModule', () => {
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [CarrosModule],
      providers: [PrismaService],
    }).compile();
  });

  it('deve compilar o módulo', async () => {
    expect(module).toBeDefined();
  });

  it('deve injetar o CarService corretamente', () => {
    const service = module.get<CarService>(CarService);
    expect(service).toBeDefined();
  });

  it('deve injetar o CarController corretamente', () => {
    const controller = module.get<CarController>(CarController);
    expect(controller).toBeDefined();
  });

  it('deve injetar o PrismaService corretamente', () => {
    const prisma = module.get<PrismaService>(PrismaService);
    expect(prisma).toBeDefined();
  });
});
