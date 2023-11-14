import {
  Context,
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
} from 'aws-lambda';
import * as fastify from 'fastify';
import { proxy } from 'aws-serverless-fastify';
import bootstrap from './app';

let fastifyInstance: fastify.FastifyInstance;

export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context,
): Promise<APIGatewayProxyResult> => {
  if (!fastifyInstance) {
    fastifyInstance = await bootstrap();
  }
  return await proxy(fastifyInstance, event, context);
};
