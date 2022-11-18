import { IsString, IsUUID } from 'class-validator';

export class DeleteTeamMemberDto {
  @IsString()
  @IsUUID(4)
  userId: string;
}
