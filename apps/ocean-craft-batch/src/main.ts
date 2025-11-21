import { NestFactory } from '@nestjs/core';
import { OceanCraftBatchModule } from './ocean-craft-batch.module';

async function bootstrap() {
  const app = await NestFactory.create(OceanCraftBatchModule);
  await app.listen(process.env.PORT_BATCH ?? 3000);
}
bootstrap();
