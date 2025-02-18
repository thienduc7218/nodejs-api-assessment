import { Logger, ValidationPipe } from '@nestjs/common';
import { ConfigService, ConfigType } from '@nestjs/config';
import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import { APP_ENV, appEnv } from './app.env';
import { AppModule } from './app.module';
import { AllExceptionsFilter } from './common/exception.filter';


async function bootstrap() {
  // init app
  const app = await NestFactory.create(AppModule, { logger: ['log', 'fatal', 'error', 'warn', 'debug'] });

  // init config
  const configService = app.get(ConfigService);
  const env = configService.get<ConfigType<typeof appEnv>>(APP_ENV);

  // config for app
  app.use(json())
  app.use(urlencoded({ extended: true }))
  app.enableCors();

  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true, forbidNonWhitelisted: true }));

  const { httpAdapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));
  app.setGlobalPrefix(env.prefix)

  // swagger setup
  const swgBuilder = new DocumentBuilder()
    .setTitle('Server API Docs')

  const document = SwaggerModule.createDocument(app, swgBuilder.build());
  SwaggerModule.setup('api-doc', app, document, { jsonDocumentUrl: 'api-json' });


  // start app
  await app.listen(env.port, '0.0.0.0');
  Logger.log(`🚀 Application is running on: ${await app.getUrl()}/${env.prefix}`);
}
bootstrap();
