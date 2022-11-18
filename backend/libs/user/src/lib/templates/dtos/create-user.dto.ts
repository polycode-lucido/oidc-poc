import { IsEmail, IsString, Length } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @Length(3, 20)
  username: string;

  @IsString()
  @Length(8, 255)
  password: string;

  @IsEmail()
  email: string;
}
