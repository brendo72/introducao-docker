import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../auth.service';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../../prisma/prisma.service';

describe('AuthService', () => {
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        PrismaService,
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  it('deve registrar usuário', async () => {
    const spy = jest.spyOn(service, 'register').mockResolvedValue({
      id: 1, username: 'test', email: 'test@test.com', role: 'USER'
    });
    const result = await service.register({ username: 'test', email: 'test@test.com', password: '123' });
    expect(result.email).toBe('test@test.com');
  });
});
