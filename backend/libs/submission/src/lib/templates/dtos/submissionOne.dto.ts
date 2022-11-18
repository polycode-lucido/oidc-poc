import { RunnerLanguages } from '@polycode/runner-consumer';
import { IsString, IsNotEmpty, IsEnum } from 'class-validator';

export class SubmissionOneDTO {
  @IsNotEmpty()
  @IsEnum(RunnerLanguages)
  language: RunnerLanguages;

  @IsString()
  @IsNotEmpty()
  code: string;

  version?: string;
}
