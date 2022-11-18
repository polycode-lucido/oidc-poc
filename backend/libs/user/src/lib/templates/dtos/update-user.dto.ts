import { IsOptional, IsString, Length } from 'class-validator';

export class UpdateUserDto {
  @IsString()
  @Length(3, 20)
  @IsOptional()
  username: string;

  @IsString()
  @IsOptional()
  description: string;
}
