import { OmitType } from '@nestjs/mapped-types';
import { UpdateValidatorDto } from '@polycode/validator';
import { Type } from 'class-transformer';
import {
  IsArray,
  IsObject,
  IsOptional,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import {
  CreateComponentDataDto,
  CreateComponentDto,
} from './create-component.dto';

export class UpdateComponentDataDto extends OmitType(CreateComponentDataDto, [
  'components',
  'validators',
]) {
  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateComponentDto)
  components: UpdateComponentDto[];

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UpdateValidatorDto)
  validators: UpdateValidatorDto[];
}

export class UpdateComponentDto extends OmitType(CreateComponentDto, ['data']) {
  @IsOptional()
  @IsUUID()
  id: string;

  @IsObject()
  @ValidateNested()
  @Type(() => UpdateComponentDataDto)
  data: UpdateComponentDataDto;
}
