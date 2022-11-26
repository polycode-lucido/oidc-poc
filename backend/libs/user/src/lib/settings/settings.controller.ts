import { Controller, Get, Post, Patch, Body } from '@nestjs/common';
import { ApiRouteAuthenticated } from '@polycode/docs';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { UserSettingsService } from './settings.service';
import { UserId } from '@polycode/decorator';
import { GenericRoute, GenericSequelizeController } from '@polycode/generic';
import { CreateSettingsDto } from './templates/dtos/create-settings.dto';
import { UpdateSettingsDto } from './templates/dtos/update-settings.dto';
import { settingsResponseSchema } from './templates/schemas/responses/settings.response.schema';
import { patchSettingsBodySchema } from './templates/schemas/bodies/settings.body.patch.schema';
import { userIdParamSchema } from '../templates/schemas/params/userId.param.schema';
import { UserSettings } from '@polycode/shared';
import { Resource, Scopes } from 'nest-keycloak-connect';
import { ParseMePipe } from '../validation';

@Controller('user/:userId/settings')
@ApiTags('User')
@Resource('user_settings')
export class UserSettingsController extends GenericSequelizeController<
  UserSettings,
  CreateSettingsDto,
  UpdateSettingsDto
> {
  constructor(private readonly settingsService: UserSettingsService) {
    super(settingsService);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Get settings for an user',
    },
    params: [userIdParamSchema],
    response: {
      status: 200,
      description: "Returns the user's settings",
      schema: settingsResponseSchema,
    },
  })
  @Get()
  @GenericRoute()
  @Scopes('read')
  get(@UserId(ParseMePipe) userId: string) {
    return this.settingsService.findByUserId(userId);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Update settings for a user',
    },
    params: [userIdParamSchema],
    body: {
      schema: patchSettingsBodySchema,
    },
    response: {
      status: 200,
      description: "Returns the updated user's settings",
      schema: settingsResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'User not found',
      }),
    ],
  })
  @Patch()
  @GenericRoute()
  @Scopes('update')
  update(
    @UserId(ParseMePipe) userId: string,
    @Body() updateSettingsDto: UpdateSettingsDto
  ) {
    return this.settingsService.update(userId, {
      ...updateSettingsDto,
    });
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Reset user settings',
    },
    params: [userIdParamSchema],
    response: {
      description: "Returns the updated user's settings",
      schema: settingsResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'User not found',
      }),
    ],
  })
  @Post('reset')
  @GenericRoute()
  @Scopes('update')
  reset(@UserId(ParseMePipe) userId: string) {
    return this.settingsService.reset(userId);
  }
}
