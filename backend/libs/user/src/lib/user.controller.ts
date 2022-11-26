import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Patch,
  Req,
} from '@nestjs/common';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserId } from '@polycode/decorator';
import { ApiRouteAuthenticated } from '@polycode/docs';
import { GenericSequelizeController } from '@polycode/generic';
import { User } from '@polycode/shared';
import { ParseMePipe } from './validation';
import { Resource, Scopes } from 'nest-keycloak-connect';
import { CreateUserDto } from './templates/dtos/create-user.dto';
import { UpdateUserDto } from './templates/dtos/update-user.dto';
import { patchBodySchema } from './templates/schemas/bodies/user.body.patch.schema';
import { userIdParamSchema } from './templates/schemas/params/userId.param.schema';
import { getTeamsResponseSchema } from './templates/schemas/responses/get.team.response.schema';
import { userResponseSchema } from './templates/schemas/responses/user.response.schema';
import { UserService } from './user.service';

@Controller('user')
@ApiTags('User')
@Resource('user')
export class UserController extends GenericSequelizeController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private userService: UserService) {
    super(userService);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Find all users',
    },
    response: {
      status: 200,
      description: 'Returns all users',
      schema: {
        type: 'array',
        items: userResponseSchema,
      },
    },
    pagination: true,
    order: {
      enable: true,
      keys: {
        points: null,
        username: null,
      },
    },
    filter: {
      enable: true,
      keys: {
        username: {
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
      summary: 'Find a user by id',
    },
    params: [userIdParamSchema],
    response: {
      status: 200,
      description: 'Returns the user',
      schema: userResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'User not found',
      }),
    ],
  })
  @Get(':userId')
  @Scopes('read')
  async findOne(@UserId(ParseMePipe) id: string) {
    const user = await this.userService.findByIdWithRank(id);

    return this.userService.format(user);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Update a user',
    },
    params: [userIdParamSchema],
    body: {
      schema: patchBodySchema,
    },
    response: {
      status: 200,
      description: 'Returns the updated user',
      schema: userResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'User not found',
      }),
      ApiConflictResponse({
        description: 'Username or email already exists',
      }),
    ],
  })
  @Patch(':userId')
  @Scopes('update')
  update(
    @UserId(ParseMePipe) id: string,
    @Body() updateUserDto: UpdateUserDto
  ) {
    return this._updateById(id, updateUserDto);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Delete a user',
    },
    params: [userIdParamSchema],
    response: {
      status: 204,
      description: 'Returns no content',
    },
    others: [
      ApiNotFoundResponse({
        description: 'User not found',
      }),
    ],
  })
  @Delete(':userId')
  @Scopes('delete')
  @HttpCode(204)
  remove(@UserId(ParseMePipe) id: string) {
    return this._deleteById(id);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: "Get user's teams",
      description: "Returns the user's teams",
    },
    params: [userIdParamSchema],
    response: {
      status: 200,
      description: 'Returns the teams in which the user belongs',
      schema: getTeamsResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'User not found',
      }),
    ],
  })
  @Scopes('read')
  @Get('/:userId/teams')
  @HttpCode(200)
  getUserTeams(@UserId(ParseMePipe) userId: string) {
    return this.userService.getTeams(userId);
  }
}
