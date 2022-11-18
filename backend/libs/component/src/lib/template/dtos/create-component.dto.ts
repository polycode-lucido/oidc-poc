import { RunnerLanguages } from '@polycode/runner-consumer';
import { CreateValidatorDto } from '@polycode/validator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { ComponentOrientation, ComponentType } from '@polycode/shared';

export class CreateLanguageDto {
  @IsString()
  defaultCode: string;

  @IsEnum(RunnerLanguages)
  language: RunnerLanguages;

  @IsString()
  version: string;
}

export class CreateEditorSettingsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateLanguageDto)
  languages: CreateLanguageDto[];
}

export class CreateComponentDataDto {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateComponentDto)
  components: CreateComponentDto[];

  @IsOptional()
  @IsString()
  markdown: string;

  //TODO items à remplacer
  @IsOptional()
  @IsArray()
  items: string[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateValidatorDto)
  validators: CreateValidatorDto[];

  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => CreateEditorSettingsDto)
  editorSettings: CreateEditorSettingsDto;

  @IsOptional()
  @IsString()
  orientation: ComponentOrientation;
}

export class CreateComponentDto {
  @IsString()
  type: ComponentType;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateComponentDataDto)
  data: CreateComponentDataDto;
}
