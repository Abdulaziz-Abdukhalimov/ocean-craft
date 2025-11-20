import { Module } from '@nestjs/common';
import { OceanCraftBatchController } from './ocean-craft-batch.controller';
import { OceanCraftBatchService } from './ocean-craft-batch.service';

@Module({
  imports: [],
  controllers: [OceanCraftBatchController],
  providers: [OceanCraftBatchService],
})
export class OceanCraftBatchModule {}
