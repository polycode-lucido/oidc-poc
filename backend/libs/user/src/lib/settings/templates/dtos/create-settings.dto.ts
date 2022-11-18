import { PreferredLanguage } from '@polycode/shared';
import { IsEnum, IsString } from 'class-validator';

export class CreateSettingsDto {
  @IsString()
  preferredEditingLanguage: string;

  @IsEnum(PreferredLanguage)
  preferredLanguage: PreferredLanguage;
}
