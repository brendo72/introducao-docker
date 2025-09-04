import { Controller, Get, Post, Put, Delete, Param, Body, ParseIntPipe, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiBody, ApiBearerAuth } from '@nestjs/swagger';
import { CarService,} from './carros.service';
import { CreateCarDto, UpdateCarDto } from './dto/create-car.dto';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Roles } from './roles.decorator';
import { UserRole } from '@prisma/client';
// import { Car } from '@prisma/client';

@ApiTags('carros')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
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
  @Roles('ADMIN', 'USER')
  @ApiOperation({ summary: 'Lista todos os carros' })
  @ApiResponse({ status: 200, description: 'Lista de carros', type: [CreateCarDto] })
  findAll() {
    return this.carService.findAll();
  }

  // Buscar um item por ID
  @Get(':id')
  @Roles('ADMIN')
  @ApiOperation({ summary: 'Busca um carro por ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do carro' })
  @ApiResponse({ status: 200, description: 'Carro encontrado', type: CreateCarDto })
  @ApiResponse({ status: 404, description: 'Carro não encontrado' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.carService.findOne(id);
  }

  // Atualizar um item
  @Put(':id')
  @Roles('ADMIN')
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
  @Roles(UserRole.ADMIN)
  @ApiOperation({ summary: 'Deleta um carro pelo ID' })
  @ApiParam({ name: 'id', type: Number, description: 'ID do carro' })
  @ApiResponse({ status: 200, description: 'Carro deletado com sucesso' })
  @ApiResponse({ status: 404, description: 'Carro não encontrado' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.carService.remove(id);
  }
}
