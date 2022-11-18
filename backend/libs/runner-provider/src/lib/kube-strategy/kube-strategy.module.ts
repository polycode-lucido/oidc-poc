import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RunnerOptions, RUNNER_OPTIONS } from '../runner-provider.model';
import { registerer, validationSchema } from './kube-strategy.config';
import {
  imagesProvidersFactory,
  imagesProvidersFactoryAsync,
} from './kube-strategy.provider';
import { KubeStrategyService } from './kube-strategy.service';

@Module({})
export class KubeStrategyModule {
  /**
   * Use this method if you want to give options as parameters.
   */
  static register(options?: RunnerOptions): DynamicModule {
    const validationError = validationSchema.validate(options).error;
    if (validationError) {
      throw new Error(`Runner options invalid : ${validationError}`);
    }

    return {
      imports: [],
      providers: [
        KubeStrategyService,
        {
          provide: RUNNER_OPTIONS,
          useFactory: async () => await imagesProvidersFactory(options),
        },
      ],
      module: KubeStrategyModule,
      exports: [KubeStrategyService],
    };
  }

  /**
   * Use this method if you want to load options from environment variables.
   */
  static async registerAsync(): Promise<DynamicModule> {
    return {
      imports: [
        ConfigModule.forRoot({
          load: [registerer],
          validationSchema: validationSchema,
        }),
      ],
      providers: [
        KubeStrategyService,
        {
          provide: RUNNER_OPTIONS,
          inject: [ConfigService],
          useFactory: async (config: ConfigService) =>
            await imagesProvidersFactoryAsync(config),
        },
      ],
      module: KubeStrategyModule,
      exports: [KubeStrategyService],
    };
  }
}
