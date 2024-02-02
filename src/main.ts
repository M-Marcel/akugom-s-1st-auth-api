import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  const options = new DocumentBuilder()
    .setTitle('Cloudpad Admin API Documentation')
    .setDescription(
      'This documentation explains how to interact with the Cloudax Oracle API.',
    )
    .setVersion('1.0')
    .addServer('http://localhost:3001/', 'Local environment')
    // .addServer('https://staging.yourapi.com/', 'Staging')
    // .addServer(
    //   'https://cloudax-oracle-9495f8c3897e.herokuapp.com/',
    //   'Production',
    // )
    .addTag('Cloudpad Admin Api')
    .addBearerAuth(
      { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' },
      'JWT',
    )
    .build();
  // global validation pipe
  app.useGlobalPipes(new ValidationPipe());
  const document = SwaggerModule.createDocument(app, options);
  SwaggerModule.setup('api-docs', app, document);
  await app.listen(process.env.PORT || 3001);
}
bootstrap();
