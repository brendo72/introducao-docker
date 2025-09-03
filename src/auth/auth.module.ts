import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from '../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './strategies/jwt.strategy';
import { GoogleService } from './google-auth.service';

@Module({
  imports: [JwtModule.register({ secret: 'SECRET_KEY', signOptions: { expiresIn: '1h' } })],
  controllers: [AuthController],
  providers: [AuthService, PrismaService, JwtStrategy, GoogleService],
  exports: [AuthService],
})
export class AuthModule {}
