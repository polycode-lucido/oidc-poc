import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpCode,
} from '@nestjs/common';
import { ApiRouteAuthenticated } from '@polycode/docs';
import { ApiTags } from '@nestjs/swagger';
import { TeamProviderService } from './team-provider.service';
import { CreateTeamDto } from './template/dtos/create-team.dto';
import { UpdateTeamDto } from './template/dtos/update-user.dto';
import { createBodySchema } from './template/schemas/team/body/team.body.create.schema';
import { teamResponseSchema } from './template/schemas/team/response/team.response.schema';
import { teamIdParamSchema } from './template/schemas/team/params/team-id.param.schema';
import { patchBodySchema } from './template/schemas/team/body/team.body.patch.schema';
import { GenericRoute, GenericSequelizeController } from '@polycode/generic';
import { Team } from '@polycode/shared';
import { Resource, Scopes } from 'nest-keycloak-connect';

@Controller('team')
@ApiTags('Team')
@Resource('team')
export class TeamProviderController extends GenericSequelizeController<
  Team,
  CreateTeamDto,
  UpdateTeamDto
> {
  constructor(private readonly teamProviderService: TeamProviderService) {
    super(teamProviderService);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Create a new team',
    },
    body: {
      schema: createBodySchema,
    },
    response: {
      status: 201,
      description: 'Returns the created team',
      schema: teamResponseSchema,
    },
  })
  @Post()
  @Scopes('create')
  @GenericRoute()
  create(@Body() createTeamDto: CreateTeamDto, @Req() request) {
    return this.teamProviderService.create(
      createTeamDto,
      request.authorization.subject.internalIdentifier
    );
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Find all teams',
    },
    response: {
      status: 200,
      description: 'Returns all teams',
      schema: {
        type: 'array',
        items: teamResponseSchema,
      },
    },
    pagination: true,
    order: {
      enable: true,
      keys: {
        name: null,
      },
    },
    filter: {
      enable: true,
      keys: {
        name: {
          matching: true,
        },
      },
    },
  })
  @Get()
  @Scopes('read')
  findAll(@Req() request) {
    return this._getAllAndCount(request);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Find a team by id',
    },
    params: [teamIdParamSchema],
    response: {
      status: 200,
      description: 'Returns the team',
      schema: teamResponseSchema,
    },
  })
  @Get(':teamId')
  @Scopes('read')
  findOne(@Param('teamId') id: string) {
    return this._getById(id);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Update a team',
    },
    params: [teamIdParamSchema],
    body: {
      schema: patchBodySchema,
    },
    response: {
      status: 200,
      description: 'Returns the updated user',
      schema: teamResponseSchema,
    },
  })
  @Patch(':teamId')
  @Scopes('update')
  @GenericRoute()
  async update(
    @Param('teamId') id: string,
    @Body() updateTeamDto: UpdateTeamDto
  ) {
    return this.teamProviderService.update(id, updateTeamDto);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Delete a team',
    },
    params: [teamIdParamSchema],
    response: {
      status: 204,
      description: 'Returns no content',
    },
  })
  @HttpCode(204)
  @Delete(':teamId')
  @Scopes('delete')
  async delete(@Param('teamId') id: string) {
    await this.teamProviderService.delete(id);
  }
}
