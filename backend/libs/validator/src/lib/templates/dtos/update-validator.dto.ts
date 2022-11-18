import { IsOptional, IsUUID } from 'class-validator';
import { CreateValidatorDto } from './create-validator.dto';

export class UpdateValidatorDto extends CreateValidatorDto {
  @IsOptional()
  @IsUUID()
  id: string;
}
