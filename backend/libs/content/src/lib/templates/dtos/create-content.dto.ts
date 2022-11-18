import { CreateComponentDto } from '@polycode/component';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNumber,
  IsObject,
  IsString,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { ContentType } from '@polycode/shared';

export class CreateContentDto {
  @IsString()
  @MinLength(3)
  name: string;

  @IsString()
  @MinLength(3)
  description: string;

  @IsEnum(ContentType)
  type: ContentType;

  @IsNumber()
  @Min(0)
  reward: number;

  @ValidateNested()
  @Type(() => CreateComponentDto)
  rootComponent: CreateComponentDto;

  @IsObject()
  data: Record<string, unknown>;
}
