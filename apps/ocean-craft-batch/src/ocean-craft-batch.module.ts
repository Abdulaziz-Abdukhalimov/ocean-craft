import { Module } from '@nestjs/common';
import { OceanCraftBatchController } from './ocean-craft-batch.controller';
import { OceanCraftBatchService } from './ocean-craft-batch.service';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot()],
  controllers: [OceanCraftBatchController],
  providers: [OceanCraftBatchService],
})
export class OceanCraftBatchModule {}
