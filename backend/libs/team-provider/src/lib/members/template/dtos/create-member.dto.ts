import { IsString, IsUUID } from 'class-validator';

export class CreateTeamMemberDto {
  @IsString()
  @IsUUID(4)
  userId: string;
}
