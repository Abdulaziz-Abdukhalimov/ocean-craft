import { Test, TestingModule } from '@nestjs/testing';
import { OceanCraftBatchController } from './ocean-craft-batch.controller';
import { OceanCraftBatchService } from './ocean-craft-batch.service';

describe('OceanCraftBatchController', () => {
  let oceanCraftBatchController: OceanCraftBatchController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [OceanCraftBatchController],
      providers: [OceanCraftBatchService],
    }).compile();

    oceanCraftBatchController = app.get<OceanCraftBatchController>(OceanCraftBatchController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(oceanCraftBatchController.getHello()).toBe('Hello World!');
    });
  });
});
