
// MOCK de todos os decorators e classes do Swagger antes de qualquer import
jest.mock('@nestjs/swagger', () => {
  class MockDocumentBuilder {
    setTitle() { return this; }
    setDescription() { return this; }
    setVersion() { return this; }
    addTag() { return this; }
    build() { return {}; }
  }

  const noopDecorator = () => () => {};

  return {
    DocumentBuilder: MockDocumentBuilder,
    SwaggerModule: {
      createDocument: jest.fn().mockReturnValue({}),
      setup: jest.fn(),
    },
    ApiProperty: noopDecorator,
    ApiTags: noopDecorator,
    ApiOperation: noopDecorator,
    ApiResponse: noopDecorator,
    ApiBody: noopDecorator,
    ApiParam: noopDecorator,
    PartialType: (x: any) => x,
  };
});

// MOCK do NestFactory
jest.mock('@nestjs/core', () => ({
  NestFactory: {
    create: jest.fn(),
  },
}));

// MOCK do ValidationPipe
jest.mock('@nestjs/common', () => {
  const originalModule = jest.requireActual('@nestjs/common');
  return {
    ...originalModule,
    ValidationPipe: jest.fn().mockImplementation((options) => ({ options })),
  };
});

import { AppModule } from '../app.module';
import { NestFactory } from '@nestjs/core';
const { SwaggerModule } = require('@nestjs/swagger');
const { ValidationPipe } = require('@nestjs/common');

describe('main.ts', () => {
  let appMock: any;

  beforeEach(() => {
    appMock = {
      useGlobalPipes: jest.fn(),
      listen: jest.fn(),
    };
    (NestFactory.create as jest.Mock).mockResolvedValue(appMock);
    jest.clearAllMocks();
  });

  it('deve inicializar a aplicação, configurar Swagger e ValidationPipe', async () => {
    const { bootstrap } = await import('../main');
    await bootstrap();

    // Verifica se o NestFactory criou a aplicação
    expect(NestFactory.create).toHaveBeenCalledWith(AppModule);

    // Verifica Swagger
    expect(SwaggerModule.createDocument).toHaveBeenCalledWith(appMock, expect.any(Object));
    expect(SwaggerModule.setup).toHaveBeenCalledWith('api', appMock, {});

    // Verifica ValidationPipe
    expect(appMock.useGlobalPipes).toHaveBeenCalled();
    const pipe = appMock.useGlobalPipes.mock.calls[0][0];
    expect(pipe.options).toMatchObject({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    });

    // Verifica se app.listen foi chamado na porta correta
    expect(appMock.listen).toHaveBeenCalledWith(process.env.PORT ?? 3000);
  });
});