import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RunnerOptions, RUNNER_OPTIONS } from '../runner-provider.model';
import {
  imagesProvidersFactory,
  imagesProvidersFactoryAsync,
} from './docker-strategy.providers';
import { registerer, validationSchema } from './docker-strategy.config';
import { DockerStrategyService } from './docker-strategy.service';

@Module({
  imports: [],
  providers: [
    DockerStrategyService,
    {
      provide: RUNNER_OPTIONS,
      useFactory: async () => await imagesProvidersFactory({}),
    },
  ],
  exports: [DockerStrategyService],
})
export class DockerStrategyModule {
  /**
   * Use this method if you want to give options as parameters.
   */
  static register(options?: RunnerOptions): DynamicModule {
    return {
      imports: [],
      providers: [
        DockerStrategyService,
        {
          provide: RUNNER_OPTIONS,
          useFactory: async () => await imagesProvidersFactory(options),
        },
      ],
      module: DockerStrategyModule,
      exports: [DockerStrategyService],
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
        DockerStrategyService,
        {
          provide: RUNNER_OPTIONS,
          inject: [ConfigService],
          useFactory: async (configService: ConfigService) =>
            await imagesProvidersFactoryAsync(configService),
        },
      ],
      module: DockerStrategyModule,
      exports: [DockerStrategyService],
    };
  }
}
