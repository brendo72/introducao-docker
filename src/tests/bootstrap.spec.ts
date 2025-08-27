import { bootstrap } from '../main';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';

// Mock do Swagger para testes
jest.mock('@nestjs/swagger', () => {
  const decoratorMock = jest.fn(() => () => {}); // qualquer decorator que não faça nada

  return {
    // DocumentBuilder mock
    DocumentBuilder: jest.fn().mockImplementation(() => ({
      setTitle: jest.fn().mockReturnThis(),
      setDescription: jest.fn().mockReturnThis(),
      setVersion: jest.fn().mockReturnThis(),
      addTag: jest.fn().mockReturnThis(),
      build: jest.fn().mockReturnValue({}),
    })),
    // SwaggerModule mock
    SwaggerModule: {
      createDocument: jest.fn().mockReturnValue({}),
      setup: jest.fn(),
    },
    // Todos os decorators usados
    ApiProperty: decoratorMock,
    ApiTags: decoratorMock,
    ApiOperation: decoratorMock,
    ApiResponse: decoratorMock,
    ApiBody: decoratorMock,
    ApiParam: decoratorMock,
    PartialType: jest.fn((classRef) => classRef),
  };
});

describe('bootstrap()', () => {
  let appMock: any;

  beforeEach(() => {
    appMock = {
      listen: jest.fn(),
      useGlobalPipes: jest.fn(),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(appMock);
  });
     // Sobrescreve create para retornar nosso app mock
    (NestFactory.create as jest.Mock) = jest.fn().mockResolvedValue(appMock);


  afterEach(() => {
    jest.clearAllMocks();
  });

  it('deve criar a aplicação e chamar listen(3000)', async () => {
    await bootstrap();

    expect(NestFactory.create).toHaveBeenCalled();
    expect(appMock.useGlobalPipes).toHaveBeenCalledWith(expect.any(ValidationPipe));
    expect(appMock.listen).toHaveBeenCalledWith(3000);
  });
});
