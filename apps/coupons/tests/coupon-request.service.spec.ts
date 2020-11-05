import { Test, TestingModule } from '@nestjs/testing';
import { CouponsRequestService } from '../src/v1/services';

describe('MailService', () => {
  let service: CouponsRequestService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CouponsRequestService],
    }).compile();

    service = module.get<CouponsRequestService>(CouponsRequestService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
