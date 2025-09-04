import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterUserDto } from './dto/register.dto';
import { LoginResponseDto } from './dto/login-response.dtos';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new UnauthorizedException('Usuário não encontrado');
    }
    const passwordValid = await bcrypt.compare(password, user.password);
    if (!passwordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }
    return user;
  }

  async registerUser(userData: RegisterUserDto) {
    const userExists = await this.prisma.user.findUnique({
    where: {email: userData.email}
    })
    if(userExists){
    throw new ConflictException("Email já está em uso!")
  }

    const hashedPassword = await bcrypt.hash(
    userData.password, 10)


    const newUser = await this.prisma.user.create({
      data: {
            username: userData.name,
            email: userData.email,
            password: hashedPassword
    },
      select: {
            id: true,
            email: true,
            role: true
    }
        })
        
      return newUser;
  }

  async login(credentials: LoginDto): Promise<{ access_token: string }> {
        const user = await this.validateUser(
            credentials.email,
            credentials.password
        )         
        
        const payload = {
            userId: user.id,
            email: user.email,
            role: user.role
        }

        return {
            access_token: this.jwtService.sign(payload)
        }

    }

}
