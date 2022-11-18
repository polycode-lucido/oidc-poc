import { DynamicModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RunnerProviderType } from '@polycode/runner-consumer';
import { DockerStrategyModule } from './docker-strategy/docker-strategy.module';
import { DockerStrategyService } from './docker-strategy/docker-strategy.service';
import { ForkStrategyModule } from './fork-strategy/fork-strategy.module';
import { ForkStrategyService } from './fork-strategy/fork-strategy.service';
import { KubeStrategyModule } from './kube-strategy/kube-strategy.module';
import { KubeStrategyService } from './kube-strategy/kube-strategy.service';
import {
  RunnerProviderEnvironmentVariables,
  validate,
} from './runner-provider.config';
import { RunnerProviderController } from './runner-provider.controller';
import { RunnerProviderService } from './runner-provider.service';

export const RUNNER_PROVIDER_SERVICE = 'runnerProviderService';

@Module({})
export class RunnerProviderModule {
  static forRoot(): DynamicModule {
    // Can't load ConfigModule & ConfigService here, so we have to check env manually
    const runnerProvider = process.env['RUNNER_PROVIDER'];
    const runnerProviderEnvironmentVariables =
      new RunnerProviderEnvironmentVariables();

    if (runnerProvider && validate({ RUNNER_PROVIDER: runnerProvider })) {
      runnerProviderEnvironmentVariables.RUNNER_PROVIDER =
        runnerProvider as RunnerProviderType;
    }

    const common = {
      module: RunnerProviderModule,
      exports: [],
      controllers: [RunnerProviderController],
      imports: [ConfigModule.forRoot({ validate })],
    };
    switch (runnerProviderEnvironmentVariables.RUNNER_PROVIDER) {
      case RunnerProviderType.ForkExec:
        return {
          ...common,
          imports: [...common.imports, ForkStrategyModule.registerAsync()],
          providers: [
            RunnerProviderService,
            {
              provide: RUNNER_PROVIDER_SERVICE,
              useExisting: ForkStrategyService,
            },
          ],
        };
      case RunnerProviderType.Docker:
        return {
          ...common,
          imports: [...common.imports, DockerStrategyModule.registerAsync()],
          providers: [
            RunnerProviderService,
            {
              provide: RUNNER_PROVIDER_SERVICE,
              useExisting: DockerStrategyService,
            },
          ],
        };
      case RunnerProviderType.Kubernetes:
        return {
          ...common,
          imports: [...common.imports, KubeStrategyModule.registerAsync()],
          providers: [
            RunnerProviderService,
            {
              provide: RUNNER_PROVIDER_SERVICE,
              useExisting: KubeStrategyService,
            },
          ],
        };
      default:
        throw new Error(
          `RunnerProviderType ${runnerProviderEnvironmentVariables.RUNNER_PROVIDER} is not supported`
        );
    }
  }
}
