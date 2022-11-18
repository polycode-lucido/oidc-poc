import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Delete,
  HttpCode,
  Req,
} from '@nestjs/common';
import { Authorize } from '@polycode/auth-consumer';
import { UserService } from './user.service';
import { CreateUserDto } from './templates/dtos/create-user.dto';
import { UpdateUserDto } from './templates/dtos/update-user.dto';
import { ApiRoute, ApiRouteAuthenticated } from '@polycode/docs';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { userResponseSchema } from './templates/schemas/responses/user.response.schema';
import { createUserBodySchema } from './templates/schemas/bodies/user.body.create.schema';
import { userIdParamSchema } from './templates/schemas/params/userId.param.schema';
import { patchBodySchema } from './templates/schemas/bodies/user.body.patch.schema';
import { UserId } from '@polycode/decorator';
import { GenericRoute, GenericSequelizeController } from '@polycode/generic';
import {
  UserReadAllAuthorization,
  UserReadSelfAuthorize,
  UserReadUpdateSelfAuthorize,
  UserDeleteSelfAuthorize,
} from './templates/policies';
import { getTeamsResponseSchema } from './templates/schemas/responses/get.team.response.schema';
import { User } from '@polycode/shared';

@Controller('user')
@ApiTags('User')
export class UserController extends GenericSequelizeController<
  User,
  CreateUserDto,
  UpdateUserDto
> {
  constructor(private userService: UserService) {
    super(userService);
  }

  @ApiRoute({
    operation: {
      summary: 'Register/Create a new user',
    },
    body: {
      schema: createUserBodySchema,
    },
    response: {
      status: 201,
      description: 'Returns the created user',
      schema: userResponseSchema,
    },
    others: [
      ApiConflictResponse({
        description: 'Username or email already exists',
      }),
    ],
  })
  @Post()
  @GenericRoute()
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
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
  @Authorize(UserReadAllAuthorization)
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
  @Authorize(UserReadSelfAuthorize)
  async findOne(@UserId() id: string) {
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
  @Authorize(UserReadUpdateSelfAuthorize)
  update(@UserId() id: string, @Body() updateUserDto: UpdateUserDto) {
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
  @Authorize(UserDeleteSelfAuthorize)
  @HttpCode(204)
  remove(@UserId() id: string) {
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
  @Authorize(UserReadSelfAuthorize)
  @Get('/:userId/teams')
  @HttpCode(200)
  getUserTeams(@UserId() userId: string) {
    return this.userService.getTeams(userId);
  }
}
