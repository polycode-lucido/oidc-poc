import { IsString, IsNotEmpty, IsUUID, IsBoolean } from 'class-validator';

export class ValidatorDTO {
  @IsString()
  @IsNotEmpty()
  @IsUUID(4)
  validatorId: string;

  @IsBoolean()
  success: boolean;
}
