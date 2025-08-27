import { Test, TestingModule } from '@nestjs/testing';
import { CarService } from '../carros.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { Car } from '@prisma/client';

describe('CarService', () => {
  let service: CarService;
  let prisma: PrismaService;

  const mockCar: Car = {
    id: 1,
    modelo: 'Civic',
    marca: 'Honda',
    ano: 2022,
    cor: 'Preto',
    placa: 'ABC-1234',
    quilometragem: 10000,
    combustivel: 'GASOLINA' as any, // se FuelType for enum, da o valor válido
    preco: 120000,
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  const prismaMock = {
    car: {
      create: jest.fn().mockResolvedValue(mockCar),
      findMany: jest.fn().mockResolvedValue([mockCar]),
      findUnique: jest.fn().mockResolvedValue(mockCar),
      update: jest.fn().mockResolvedValue({ ...mockCar, cor: 'Branco' }),
      delete: jest.fn().mockResolvedValue(mockCar),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CarService,
        {
          provide: PrismaService,
          useValue: prismaMock,
        },
      ],
    }).compile();

    service = module.get<CarService>(CarService);
    prisma = module.get<PrismaService>(PrismaService);
  });

  it('deve ser definido', () => {
    expect(service).toBeDefined();
    expect(prisma).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um carro', async () => {
      const result = await service.create({
        modelo: 'Civic',
        marca: 'Honda',
        ano: 2022,
        cor: 'Preto',
        placa: 'ABC-1234',
        quilometragem: 10000,
        combustivel: 'GASOLINA' as any,
        preco: 120000,
      });
      expect(prisma.car.create).toHaveBeenCalled();
      expect(result).toEqual(mockCar);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de carros', async () => {
      const result = await service.findAll();
      expect(prisma.car.findMany).toHaveBeenCalled();
      expect(result).toEqual([mockCar]);
    });
  });

  describe('findOne', () => {
    it('deve retornar um carro por id', async () => {
      const result = await service.findOne(1);
      expect(prisma.car.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockCar);
    });

    it('deve lançar NotFoundException se não achar', async () => {
      jest.spyOn(prisma.car, 'findUnique').mockResolvedValueOnce(null);
      await expect(service.findOne(999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um carro', async () => {
      const result = await service.update(1, { cor: 'Branco' });
      expect(prisma.car.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { cor: 'Branco' },
      });
      expect(result.cor).toBe('Branco');
    });
  });

  describe('remove', () => {
    it('deve remover um carro', async () => {
      const result = await service.remove(1);
      expect(prisma.car.delete).toHaveBeenCalledWith({ where: { id: 1 } });
      expect(result).toEqual(mockCar);
    });
  });
});
