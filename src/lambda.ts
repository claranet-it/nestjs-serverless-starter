import { NestFastifyApplication } from '@nestjs/platform-fastify';
import awsLambdaFastify, { PromiseHandler } from '@fastify/aws-lambda';
import { Context, APIGatewayProxyEvent } from 'aws-lambda';
import bootstrap from './app';

let cachedNestApp;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<PromiseHandler> => {
  if (!cachedNestApp) {
    const nestApp: NestFastifyApplication = await bootstrap();
    cachedNestApp = awsLambdaFastify(nestApp.getHttpAdapter().getInstance());
  }
  return cachedNestApp(event, context);
};
