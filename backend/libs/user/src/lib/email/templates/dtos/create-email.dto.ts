import { IsBoolean, IsEmail, IsOptional } from 'class-validator';

export class CreateEmailDto {
  @IsEmail()
  email: string;

  @IsBoolean()
  @IsOptional()
  isVerified = false;
}
