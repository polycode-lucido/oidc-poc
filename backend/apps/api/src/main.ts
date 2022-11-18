import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Environment } from '@polycode/env';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { ResponseFormatterInterceptor } from '@polycode/response-formatter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: process.env.NODE_ENV === Environment.PRODUCTION,
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
      skipMissingProperties: false,
      skipNullProperties: false,
      skipUndefinedProperties: false,
    })
  );

  if (process.env.NODE_ENV === Environment.PRODUCTION) {
    app.use(helmet());
  }

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  if (process.env.NODE_ENV === Environment.DEVELOPMENT) {
    const config = new DocumentBuilder()
      .setTitle('PolyCode API')
      .setDescription('Do awesome stuff with PolyCode API')
      .setVersion('1.0')
      .addBearerAuth({
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}".',
      })
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  app.useGlobalInterceptors(new ResponseFormatterInterceptor());

  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
