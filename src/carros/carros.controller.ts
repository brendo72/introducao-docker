import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody } from '@nestjs/swagger';
import { CarService,} from './carros.service';
import { CreateCarDto, UpdateCarDto } from './dto/create-car.dto';
// import { Car } from '@prisma/client';

@ApiTags('carros')
@Controller('carros')
export class CarController {
  constructor(private readonly carService: CarService) {}

  // Criar um novo item
  @Post()
  @ApiOperation({ summary: 'Cria um novo carro' })
  @ApiBody({ type: CreateCarDto })
  @ApiResponse({ status: 201, description: 'Carro criado com sucesso', type: CreateCarDto })
  create(@Body() createCarDto: CreateCarDto) {
    return this.carService.create(createCarDto);
  }

  // Listar todos os itens
  @Get()
  @ApiOperation({ summary: 'Lista todos os carros' })
  @ApiResponse({ status: 200, description: 'Lista de carros', type: [CreateCarDto] })
  findAll() {
    return this.carService.findAll();
  }

  // Buscar um item por ID
  @Get(':id')
  @ApiOperation({ summary: 'Busca um carro por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do carro' })
  @ApiResponse({ status: 200, description: 'Carro encontrado', type: CreateCarDto })
  @ApiResponse({ status: 404, description: 'Carro não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carService.findOne(id);
  }

  // Atualizar um item
  @Put(':id')
  @ApiOperation({ summary: 'Atualiza um carro pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do carro' })
  @ApiBody({ type: UpdateCarDto })
  @ApiResponse({ status: 200, description: 'Carro atualizado', type: UpdateCarDto })
  @ApiResponse({ status: 404, description: 'Carro não encontrado' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateCarDto: UpdateCarDto,
  ) {
    return this.carService.update(id, updateCarDto);
  }

  // Deletar um item
  @Delete(':id')
  @ApiOperation({ summary: 'Deleta um carro pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do carro' })
  @ApiResponse({ status: 200, description: 'Carro deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Carro não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carService.remove(id);
  }
}
