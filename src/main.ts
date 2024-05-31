import bootstrap from './app';

async function startLocal() {
  const app = await bootstrap();

  await app.listen(process.env.PORT || 3000);
}

startLocal();
