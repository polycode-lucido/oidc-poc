import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';

export class CreateValidatorInputDto {
  @IsArray()
  @IsString({ each: true })
  stdin: string[];
}

export class CreateValidatorExpectedDto {
  @IsArray()
  @IsString({ each: true })
  stdout: string[];
}
export class CreateValidatorDto {
  @IsBoolean()
  isHidden: boolean;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateValidatorInputDto)
  input: CreateValidatorInputDto;

  @IsObject()
  @ValidateNested()
  @Type(() => CreateValidatorExpectedDto)
  expected: CreateValidatorExpectedDto;
}
