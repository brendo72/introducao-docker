import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from '../app.module';
import { CarrosModule } from '../carros/carros.module';
import { PrismaService } from '../prisma/prisma.service';

describe('AppModule', () => {
  let module: TestingModule;

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [AppModule],
    })
    .overrideProvider(PrismaService) // Mock do PrismaService
    .useValue({
      $connect: jest.fn(),
      $disconnect: jest.fn(),
      car: {
        findMany: jest.fn(),
        findUnique: jest.fn(),
        create: jest.fn(),
        update: jest.fn(),
        delete: jest.fn(),
      },
    })
    .compile();
  });

  it('deve compilar o AppModule', () => {
    expect(module).toBeDefined();
  });

  it('deve importar o CarrosModule', () => {
    const carrosModule = module.get(CarrosModule, { strict: false });
    expect(carrosModule).toBeDefined();
  });

  it('deve injetar o PrismaService mockado', () => {
    const prismaService = module.get(PrismaService);
    expect(prismaService).toBeDefined();
    expect(prismaService.car.findMany).toBeDefined();
  });
});
