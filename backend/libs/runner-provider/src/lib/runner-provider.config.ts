import { RunnerProviderType } from '@polycode/runner-consumer';
import { plainToClass } from 'class-transformer';
import { IsEnum, validateSync } from 'class-validator';

export class RunnerProviderEnvironmentVariables {
  @IsEnum(RunnerProviderType)
  RUNNER_PROVIDER: RunnerProviderType = RunnerProviderType.Docker;
}

/**
 * It takes a config object, validates it, and returns the validated object
 * @param config - The configuration object to validate.
 * @returns The validated config object.
 */
export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToClass(
    RunnerProviderEnvironmentVariables,
    config,
    {
      enableImplicitConversion: true,
    }
  );

  /* This is validating the config object. */
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }

  return validatedConfig;
}
