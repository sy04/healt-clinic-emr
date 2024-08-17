import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppInterceptor } from './utils/interceptor';
import { AppExceptionFilter } from './filter/exception.filter';
import { Logger } from 'nestjs-pino';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as basicAuth from 'express-basic-auth';
import * as bodyParser from 'body-parser';
import 'dotenv/config';

export async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(function (req, res, next) {
    req.headers.origin = req.headers.origin || req.headers.host;
    next();
  });

  const corsOptions = {
    exposedHeaders: ['Content-Disposition'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    preflightContinue: false,
    optionsSuccessStatus: 204,
    credentials: true,
  };

  app.enableCors(corsOptions);

  app.use(helmet());

  app.useLogger(app.get(Logger));

  app.useGlobalInterceptors(new AppInterceptor());
  app.useGlobalFilters(new AppExceptionFilter());
  app.useGlobalPipes(new ValidationPipe());

  app.use(
    ['/api', '/api-json'],
    basicAuth({
      challenge: true,
      users: {
        [process.env.SWAGGER_USER]: process.env.SWAGGER_PASS,
      },
    }),
  );

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('Quiz Games Documentation')
      .setDescription('Quiz Games Documentation')
      .setVersion('1.0')
      .addBearerAuth()
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document);
  }

  app.useLogger(app.get(Logger));

  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  await app.listen(3000);
}
bootstrap();
