import { IsOptional, IsString, Length } from 'class-validator';

export class CreateTeamDto {
  @IsString()
  @Length(3, 20)
  name: string;

  @IsString()
  @Length(0, 255)
  @IsOptional()
  description: string;
}
