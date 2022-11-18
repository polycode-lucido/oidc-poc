import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { registerer, validationSchema } from './templater.config';
import { TemplaterService } from './templater.service';

describe('TemplaterService', () => {
  let service: TemplaterService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot({ load: [registerer], validationSchema })],
      providers: [TemplaterService],
    }).compile();

    service = module.get<TemplaterService>(TemplaterService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
