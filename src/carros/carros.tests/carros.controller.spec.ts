import { Test, TestingModule } from '@nestjs/testing';
import { CarController } from '../carros.controller';
import { CarService } from '../carros.service';
import { CreateCarDto, FuelType, UpdateCarDto } from '../dto/create-car.dto';

describe('CarController', () => {
  let controller: CarController;
  let service: CarService;

  const mockCarService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [CarController],
      providers: [
        {
          provide: CarService,
          useValue: mockCarService,
        },
      ],
    }).compile();

    controller = module.get<CarController>(CarController);
    service = module.get<CarService>(CarService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('deve chamar service.create e retornar o carro criado', async () => {
      const dto: CreateCarDto = {
        modelo: 'Civic',
        marca: 'Honda',
        ano: 2022,
        cor: 'Preto',
        placa: 'ABC1234',
        quilometragem: 10000,
        combustivel: FuelType.GASOLINA,
        preco: 120000,
      };

      const result = { id: 1, ...dto };
      jest.spyOn(service, 'create').mockResolvedValue(result as any);

      expect(await controller.create(dto)).toEqual(result);
      expect(service.create).toHaveBeenCalledWith(dto);
    });
  });

  describe('findAll', () => {
    it('deve retornar uma lista de carros', async () => {
      const result = [{ id: 1, modelo: 'Civic', marca: 'Honda' }];
      jest.spyOn(service, 'findAll').mockResolvedValue(result as any);

      expect(await controller.findAll()).toEqual(result);
    });
  });

  describe('findOne', () => {
    it('deve retornar um carro pelo id', async () => {
      const result = { id: 1, modelo: 'Civic', marca: 'Honda' };
      jest.spyOn(service, 'findOne').mockResolvedValue(result as any);

      expect(await controller.findOne(1)).toEqual(result);
      expect(service.findOne).toHaveBeenCalledWith(1);
    });
  });

  describe('update', () => {
    it('deve atualizar e retornar o carro', async () => {
      const dto: UpdateCarDto = { cor: 'Branco' };
      const result = { id: 1, modelo: 'Civic', marca: 'Honda', cor: 'Branco' };
      jest.spyOn(service, 'update').mockResolvedValue(result as any);

      expect(await controller.update(1, dto)).toEqual(result);
      expect(service.update).toHaveBeenCalledWith(1, dto);
    });
  });

  describe('remove', () => {
    it('deve chamar service.remove com o id correto', async () => {
      jest.spyOn(service, 'remove').mockResolvedValue(undefined as any);

      await controller.remove(1);
      expect(service.remove).toHaveBeenCalledWith(1);
    });
  });
});
