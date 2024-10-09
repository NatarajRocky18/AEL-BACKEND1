import { Test, TestingModule } from '@nestjs/testing';
import { EntitieshandlerController } from './entitieshandler.controller';

describe('EntitieshandlerController', () => {
  let controller: EntitieshandlerController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [EntitieshandlerController],
    }).compile();

    controller = module.get<EntitieshandlerController>(EntitieshandlerController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
