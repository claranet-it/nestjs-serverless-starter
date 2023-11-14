import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import fastify, { FastifyInstance } from 'fastify';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

export default async function bootstrap(): Promise<FastifyInstance> {
  const serverOptions = {
    logger: true,
  };
  const instance = fastify(serverOptions);

  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(instance),
  );

  app.useGlobalPipes(new ValidationPipe());

  await app.init();
  return instance;
}
