import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
        .setTitle('API de Usuários')
        .setDescription('Documentação da API de usuários com NestJS + Prisma + Swagger')
        .setVersion('1.0')
        .addTag('users') // Tag opcional para categorizar as rotas
        .build();
        
        const document = SwaggerModule.createDocument(app, config);
        SwaggerModule.setup('api', app, document); // Acessível em http://localhost:3000/api
        
        app.useGlobalPipes(
          new ValidationPipe({
            whitelist: true, // Remove propriedades não decoradas no DTO
            forbidNonWhitelisted: true, // Retorna erro se enviar propriedades não permitidas
            transform: true, // Transforma os tipos automaticamente (ex: string para number)
          })
  );
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
