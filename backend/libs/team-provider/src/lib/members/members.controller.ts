import {
  Body,
  Controller,
  Delete,
  Param,
  ParseUUIDPipe,
  Post,
  Req,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { ApiRouteAuthenticated } from '@polycode/docs';
import { teamResponseSchema } from '../template/schemas/team/response/team.response.schema';
import { TeamMembersService } from './members.service';
import { CreateTeamMemberDto } from './template/dtos/create-member.dto';
import { DeleteTeamMemberDto } from './template/dtos/delete-member.dto';
import { createTeamMemberBodySchema } from './template/schemas/member/body/member.body.create.schema';
import { deleteTeamMemberBodySchema } from './template/schemas/member/body/member.body.delete.schema';
import { TeamProviderService } from '../team-provider.service';
import { Authorize } from '@polycode/auth-consumer';
import {
  TeamMemberCreateAuthorize,
  TeamMemberDeleteAuthorize,
} from './template/policies';

@Controller('team/:teamId/members')
@ApiTags('Team')
export class TeamMembersController {
  constructor(
    private readonly teamMembersService: TeamMembersService,
    private readonly teamProviderService: TeamProviderService
  ) {}

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Add a member to a team.',
    },
    body: {
      schema: createTeamMemberBodySchema,
    },
    response: {
      status: 201,
      description: 'Returns the updated team',
      schema: teamResponseSchema,
    },
    others: [
      ApiConflictResponse({
        description: 'The user is already a member of the team',
      }),
    ],
  })
  @Post()
  @Authorize(TeamMemberCreateAuthorize)
  async create(
    @Req() request,
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() createTeamMemberDto: CreateTeamMemberDto
  ) {
    const newTeam = await this.teamMembersService.addMember(
      teamId,
      createTeamMemberDto,
      request.authorization.subject.internalIdentifier
    );

    return this.teamProviderService.format(newTeam);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Remove a member from a team.',
    },
    body: {
      schema: deleteTeamMemberBodySchema,
    },
    response: {
      status: 200,
      description: 'Returns the updated team',
      schema: teamResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'The user is not a member of the team',
      }),
    ],
  })
  @Delete()
  @Authorize(TeamMemberDeleteAuthorize)
  async delete(
    @Param('teamId', ParseUUIDPipe) teamId: string,
    @Body() deleteTeamMemberDto: DeleteTeamMemberDto
  ) {
    const newTeam = await this.teamMembersService.deleteMember(
      teamId,
      deleteTeamMemberDto
    );

    return this.teamProviderService.format(newTeam);
  }
}
