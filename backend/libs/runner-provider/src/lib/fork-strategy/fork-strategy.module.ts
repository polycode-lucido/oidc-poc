import { DynamicModule } from '@nestjs/common';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RUNNER_OPTIONS } from '../runner-provider.model';
import { registerer, validationSchema } from './fork-strategy.config';
import { ForkStrategyService } from './fork-strategy.service';

@Module({})
export class ForkStrategyModule {
  static async registerAsync(): Promise<DynamicModule> {
    return {
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
      module: ForkStrategyModule,
      exports: [ForkStrategyService],
    };
  }
}
