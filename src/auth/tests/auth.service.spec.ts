import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { ConflictException, UnauthorizedException } from '@nestjs/common';
import { RegisterUserDto } from '../dto/register.dto';
import { UserRole } from '@prisma/client';

describe('AuthService', () => {
  let service: AuthService;
  let prisma: PrismaService;
  let jwtService: JwtService;

  const mockPrisma = {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('token123'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: PrismaService, useValue: mockPrisma },
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    prisma = module.get<PrismaService>(PrismaService);
    jwtService = module.get<JwtService>(JwtService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('registerUser', () => {
    it('should create a new user', async () => {
      const dto: RegisterUserDto = {
        name: 'Test User',
        email: 'test@test.com',
        password: '123456',
      };

      mockPrisma.user.findUnique.mockResolvedValue(null);
      mockPrisma.user.create.mockResolvedValue({
  id: 1,
  username: 'Test User',  // adiciona username
  email: 'test@test.com',
  password: 'hashedPassword',
  role: UserRole.USER,    // use o enum UserRole do Prisma
  createdAt: new Date(),  // adiciona createdAt
  updatedAt: new Date(),  // adiciona updatedAt
});


      const result = await service.registerUser(dto);

      expect(result).toHaveProperty('id');
      expect(result.email).toBe(dto.email);
      expect(mockPrisma.user.create).toHaveBeenCalled();
    });

    it('should throw ConflictException if email exists', async () => {
      mockPrisma.user.findUnique.mockResolvedValue({ id: 1, email: 'test@test.com' });

      await expect(
        service.registerUser({
          name: 'Test User',
          email: 'test@test.com',
          password: '123',
        }),
      ).rejects.toThrow(ConflictException);
    });
  });

  describe('login', () => {
    it('should return JWT token on valid credentials', async () => {
const user = {
  id: 1,
  username: 'Test User',          
  email: 'test@test.com',
  password: await bcrypt.hash('123456', 10),
  role: UserRole.USER,                
  createdAt: new Date(),               
  updatedAt: new Date(),              
};


      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

      const result = await service.login({ email: 'test@test.com', password: '123456' });

      expect(result).toEqual({ access_token: 'token123' });
      expect(jwtService.sign).toHaveBeenCalledWith({
        userId: user.id,
        email: user.email,
        role: user.role,
      });
    });

    it('should throw UnauthorizedException if password is wrong', async () => {
const user = {
  id: 1,
  username: 'Test User',            
  email: 'test@test.com',
  password: await bcrypt.hash('123456', 10),
  role: UserRole.USER,              
  createdAt: new Date(),               
  updatedAt: new Date(),             
};


      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(user);

      await expect(
        service.login({ email: 'test@test.com', password: 'wrong' }),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException if user not found', async () => {
      jest.spyOn(prisma.user, 'findUnique').mockResolvedValue(null);

      await expect(
        service.login({ email: 'nonexistent@test.com', password: '123456' }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
});
