import bootstrap from './app';

async function startLocal() {
  const fastifyInstance = await bootstrap();
  const serverOptions = {
    port: (process.env.PORT || 3000) as number,
  };
  await fastifyInstance.listen(serverOptions);
}

startLocal();
