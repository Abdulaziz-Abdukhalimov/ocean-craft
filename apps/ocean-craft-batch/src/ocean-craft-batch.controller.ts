import { Controller, Get } from '@nestjs/common';
import { OceanCraftBatchService } from './ocean-craft-batch.service';

@Controller()
export class OceanCraftBatchController {
  constructor(private readonly oceanCraftBatchService: OceanCraftBatchService) {}

  @Get()
  getHello(): string {
    return this.oceanCraftBatchService.getHello();
  }
}
