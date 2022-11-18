import { RunnerLanguages } from '@polycode/runner-consumer';
import { IsString, IsNotEmpty, IsUUID, IsEnum } from 'class-validator';

export class SubmissionDTO {
  @IsNotEmpty()
  @IsUUID(4)
  contentId: string;

  @IsNotEmpty()
  @IsUUID(4)
  componentId: string;

  @IsNotEmpty()
  @IsEnum(RunnerLanguages)
  language: RunnerLanguages;

  @IsString()
  @IsNotEmpty()
  code: string;

  version?: string;
}
