import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { RUNNER_OPTIONS } from '../runner-provider.model';
import { registerer, validationSchema } from './fork-strategy.config';
import { ForkStrategyService } from './fork-strategy.service';

describe('ForkStrategyService', () => {
  let service: ForkStrategyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [registerer],
          validationSchema: validationSchema,
        }),
      ],
      providers: [
        ForkStrategyService,
        {
          provide: RUNNER_OPTIONS,
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) =>
            await configService.get('forkexec'),
        },
      ],
      exports: [ForkStrategyService],
    }).compile();

    service = module.get<ForkStrategyService>(ForkStrategyService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
