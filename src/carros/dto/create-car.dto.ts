import { ApiProperty, PartialType } from "@nestjs/swagger";
import { Type } from "class-transformer";
import { IsString, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsEnum } from "class-validator";

// Se tiver enum para combustível, por exemplo:
export enum FuelType {
  GASOLINA = "GASOLINA",
  DIESEL = "DIESEL",
  ELETRICO = "ELETRICO",
  HIBRIDO = "HIBRIDO",
}

export class CreateCarDto {
  @ApiProperty({ example: "Toyota" })
  @IsString()
  @IsNotEmpty()
  marca: string;

  @ApiProperty({ example: "Corolla" })
  @IsString()
  @IsNotEmpty()
  modelo: string;

  @ApiProperty({ example: 2023 })
  @IsNumber()
  @Type(() => Number)
  ano: number;

  @ApiProperty({ example: "Prata" })
  @IsString()
  @IsNotEmpty()
  cor: string;

  @ApiProperty({ example: "ABC1D23" })
  @IsString()
  @IsNotEmpty()
  placa: string;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @Type(() => Number)
  quilometragem: number;

  @ApiProperty({ example: "GASOLINA", enum: FuelType })
  @IsEnum(FuelType)
  combustivel: FuelType;

  @ApiProperty({ example: 150000.5 })
  @IsNumber()
  @IsPositive()
  @Type(() => Number)
  preco: number;
}

// Para atualizar um carro, todos os campos são opcionais
export class UpdateCarDto extends PartialType(CreateCarDto) {}
