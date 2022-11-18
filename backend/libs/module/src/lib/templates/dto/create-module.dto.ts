import { IsArray, IsNumber, IsObject, IsString, Length } from 'class-validator';
import { ModuleType } from '@polycode/shared';

export class CreateModuleDto {
  @IsString()
  @Length(3, 30)
  name: string;

  @IsString()
  description: string;

  @IsString()
  type: ModuleType;

  @IsNumber()
  reward: number;

  @IsArray()
  tags: string[];

  @IsObject()
  data: object;

  @IsArray()
  modules: string[];

  @IsArray()
  contents: string[];
}
