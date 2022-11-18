import { OmitType } from '@nestjs/mapped-types';
import { UpdateComponentDto } from '@polycode/component';
import { Type } from 'class-transformer';
import { IsObject, ValidateNested } from 'class-validator';
import { CreateContentDto } from './create-content.dto';

export class UpdateContentDto extends OmitType(CreateContentDto, [
  'rootComponent',
]) {
  @IsObject()
  @ValidateNested()
  @Type(() => UpdateComponentDto)
  rootComponent: UpdateComponentDto;
}
