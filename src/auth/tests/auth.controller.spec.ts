import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from '../auth.controller';
import { AuthService } from '../auth.service';
import { RegisterUserDto } from '../dto/register.dto';
import { LoginDto } from '../dto/login.dto';
import { UserRole } from '@prisma/client';

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: {
            registerUser: jest.fn(),
            login: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
    service = module.get<AuthService>(AuthService);
  });

  it('deve ser definido', () => {
    expect(controller).toBeDefined();
  });

  describe('registerUser', () => {
    it('deve registrar um usuário com sucesso', async () => {
      const dto: RegisterUserDto = {
        name: 'Bruno',
        email: 'bruno@test.com',
        password: '123456',
      };

      const expectedResult = {
        id: 1,
        email: dto.email,
        role: UserRole.USER,
      };

      jest.spyOn(service, 'registerUser').mockResolvedValue(expectedResult);

      const result = await controller.registerUser(dto);

      expect(result).toEqual(expectedResult);
      expect(service.registerUser).toHaveBeenCalledWith(dto);
    });
  });

  describe('login', () => {
    it('deve retornar um token de acesso', async () => {
      const dto: LoginDto = {
        email: 'bruno@test.com',
        password: '123456',
      };

      const expectedResult = {
        access_token: 'mocked-jwt-token',
      };

      jest.spyOn(service, 'login').mockResolvedValue(expectedResult);

      const result = await controller.login(dto);

      expect(result).toEqual(expectedResult);
      expect(service.login).toHaveBeenCalledWith(dto);
    });
  });
});
