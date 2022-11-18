import { Type } from 'class-transformer';
import {
  Min,
  IsString,
  IsDefined,
  ValidateNested,
  IsNotEmpty,
  IsEnum,
} from 'class-validator';
import { ItemType } from '@polycode/shared';

class HintData {
  @IsString()
  text: string;
}

export default class CreateItemDTO {
  @Min(0)
  @IsNotEmpty()
  cost: number;

  @IsString()
  @IsNotEmpty()
  @IsEnum(ItemType)
  type: string;

  @IsDefined()
  @Type(() => HintData)
  @ValidateNested()
  data: HintData;
}
