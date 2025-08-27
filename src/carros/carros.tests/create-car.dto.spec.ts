// src/carros/dto/tests/create-car.dto.spec.ts
import { CreateCarDto, UpdateCarDto, FuelType } from '../dto/create-car.dto';
import { validate } from 'class-validator';
import { plainToInstance } from 'class-transformer';

describe('CreateCarDto', () => {
  it('deve validar um DTO válido', async () => {
    const dto = plainToInstance(CreateCarDto, {
      marca: 'Toyota',
      modelo: 'Corolla',
      ano: 2023,
      cor: 'Prata',
      placa: 'ABC1D23',
      quilometragem: 15000,
      combustivel: FuelType.GASOLINA,
      preco: 150000.5,
    });

    const errors = await validate(dto as object);
    expect(errors.length).toBe(0);
  });

  it('deve falhar quando campos obrigatórios estiverem faltando', async () => {
    const dto = plainToInstance(CreateCarDto, {});
    const errors = await validate(dto as object);
    expect(errors.length).toBeGreaterThan(0);

    // Verifica se os campos obrigatórios possuem erros
    const requiredFields = ['marca', 'modelo', 'cor', 'placa', 'quilometragem', 'combustivel', 'preco', 'ano'];
    requiredFields.forEach(field => {
      expect(errors.some(err => err.property === field)).toBe(true);
    });
  });

  it('deve falhar se valores inválidos forem fornecidos', async () => {
    const dto = plainToInstance(CreateCarDto, {
      marca: '', // obrigatório, não vazio
      ano: -2020, // número válido, mas pode ser negativo
      combustivel: 'INVALID' // enum inválido
    });

    const errors = await validate(dto as object);
    expect(errors.length).toBeGreaterThan(0);
  });
});

describe('UpdateCarDto', () => {
  it('deve permitir criar DTO parcial', async () => {
    const dto = plainToInstance(UpdateCarDto, {
      preco: 20000,
    });

    const errors = await validate(dto as object);
    expect(errors.length).toBe(0); // campos opcionais permitem DTOs parciais
  });

  it('deve validar tipos corretos quando fornecidos', async () => {
    const dto = plainToInstance(UpdateCarDto, {
      quilometragem: 'abc', // inválido
    });

    const errors = await validate(dto as object);
    expect(errors.length).toBeGreaterThan(0);
    expect(errors[0].property).toBe('quilometragem');
  });
});
