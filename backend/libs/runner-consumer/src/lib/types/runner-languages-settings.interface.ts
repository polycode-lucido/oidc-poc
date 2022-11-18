import { IsEnum, IsOptional, IsString } from 'class-validator';
import { RunnerLanguages } from './runner-languages.enum';

export class RunnerLanguagesSettings {
  @IsEnum(RunnerLanguages, {
    message: `language must be one of ${Object.values(RunnerLanguages)}`,
  })
  language: RunnerLanguages;

  @IsString()
  @IsOptional()
  version?: string;

  @IsString()
  @IsOptional()
  image?: string;
}
