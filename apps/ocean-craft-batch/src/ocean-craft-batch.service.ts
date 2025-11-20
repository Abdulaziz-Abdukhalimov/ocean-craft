import { Injectable } from '@nestjs/common';

@Injectable()
export class OceanCraftBatchService {
  getHello(): string {
    return 'Hello World from Ocean Craft batch server!';
  }
}
