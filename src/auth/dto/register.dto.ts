import { IsString, IsEmail, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '@prisma/client';
import { ApiProperty } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({ 
    description: 'Nome de usuário único para login',
    example: 'joao' })
  @IsString()
  name: string;

  @ApiProperty({ 
    description: 'Endereço de email do usuário',
    example: 'nome@gmail.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ 
    description: 'Senha do usuário, com no mínimo 6 caracteres',
    example: 'senha123' })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiProperty({ 
    description: 'Papel do usuário no sistema',
    example: UserRole.USER, enum: UserRole })
  @IsEnum(UserRole)
  role: UserRole; // 'USER' ou 'ADMIN'
}
