import { Optional } from '@nestjs/common';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsDefined,
  IsNotEmptyObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { RunnerLanguagesSettings } from './runner-languages-settings.interface';

export class RunnerWorkload {
  @IsString()
  sourceCode: string;

  @Optional()
  @IsArray()
  @IsString({ each: true })
  stdin?: string[];

  @IsDefined()
  @IsNotEmptyObject()
  @ValidateNested()
  @Type(() => RunnerLanguagesSettings)
  settings: RunnerLanguagesSettings;
}
