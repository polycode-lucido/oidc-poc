import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Environment } from '@polycode/env';
import { ResponseFormatterInterceptor } from '@polycode/response-formatter';
import helmet from 'helmet';

import { AppModule } from './app/app.module';

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
      .setTitle('PolyCode Runner API')
      .setDescription('Do awesome stuff with PolyCode Runner API')
      .setVersion('1.0')
      .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('swagger', app, document);
  }

  app.useGlobalInterceptors(new ResponseFormatterInterceptor());

  const port = !isNaN(parseInt(process.env.RUNNER_PORT))
    ? process.env.RUNNER_PORT
    : 3001;
  await app.listen(port);
}

bootstrap();
