import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
// import { Car } from '@prisma/client'; // Removed because 'Car' is not exported from '@prisma/client'
import { CreateCarDto, UpdateCarDto } from './dto/create-car.dto';

@Injectable()
export class CarService {
  constructor(private prisma: PrismaService) {}

  // i. Criar um novo carro
  async create(data: CreateCarDto) {
    return this.prisma.car.create({
      data,
    });
  }

  // Listar todos os carros
  async findAll() {
    return this.prisma.car.findMany();
  }

  // Buscar um carro por ID
  async findOne(id: number) {
    const car = await this.prisma.car.findUnique({
      where: { id },
    });

    if (!car) {
      throw new NotFoundException(`Carro com ID ${id} não encontrado`);
    }
    return car;
  }

  // Atualizar um carro
  async update(id: number, data: UpdateCarDto) {
    // garante que o carro existe antes de atualizar
    await this.findOne(id);

    return this.prisma.car.update({
      where: { id },
      data,
    });
  }

  // Deletar um carro
  async remove(id: number) {
    // garante que o carro existe antes de deletar
    await this.findOne(id);

    return this.prisma.car.delete({
      where: { id },
    });
  }
}
