import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async register(data: RegisterDto) {
    const hashedPassword = await bcrypt.hash(data.password, 10);
    const user = await this.prisma.user.create({
      data: { ...data, password: hashedPassword },
    });
    return user;
  }

  async login(data: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (!user) throw new Error('Usuário não encontrado');

    const isPasswordValid = await bcrypt.compare(data.password, user.password);
    if (!isPasswordValid) throw new Error('Senha inválida');

    const payload = { sub: user.id, role: user.role };
    return { access_token: this.jwtService.sign(payload) };
  }
   async findOrCreateGoogleUser({googleId, email, name}){
        
        let user = await this.prisma.user.findUnique({
            where: { email }
        });
        
        if(!user) {
            user = await this.prisma.user.create({
                data: {
                    email,
                    name,
                    googleId,
                    password: Math.random().toString(36)
                }
            })
        }

        return user;
    }
     singJwtForUser(user: User) {
        const payload = {
            sub: user.id,
            email: user.email,
            role: user.role
        }
        return this.jwtService.sign(payload)
    }

}

