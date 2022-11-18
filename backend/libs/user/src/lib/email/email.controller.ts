import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  HttpCode,
} from '@nestjs/common';
import { ApiRoute, ApiRouteAuthenticated } from '@polycode/docs';
import {
  ApiConflictResponse,
  ApiNotFoundResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserEmailService } from './email.service';
import { CreateEmailDto } from './templates/dtos/create-email.dto';
import { tokenParamSchema } from './templates/schemas/params/emailId.param.schema';
import { emailIdParamSchema } from './templates/schemas/params/token.param.schema';
import { emailResponseSchema } from './templates/schemas/responses/email.response.schema';
import { createEmailBodySchema } from './templates/schemas/bodies/email.body.create.schema';
import { UserId } from '@polycode/decorator';
import { GenericSequelizeController } from '@polycode/generic';
import { Authorize } from '@polycode/auth-consumer';
import {
  UserEmailCreateSelfAuthorization,
  UserEmailDeleteSelfAuthorize,
  UserEmailReadSelfAuthorization,
} from './templates/policies';
import { userIdParamSchema } from '../templates/schemas/params/userId.param.schema';
import { UserEmail } from '@polycode/shared';
import { UserService } from '../user.service';

@Controller('user')
@ApiTags('User')
export class UserEmailController extends GenericSequelizeController<
  UserEmail,
  CreateEmailDto,
  unknown
> {
  constructor(
    private readonly userEmailService: UserEmailService,
    private readonly userService: UserService
  ) {
    super(userEmailService);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Get all emails for a user',
    },
    params: [userIdParamSchema],
    response: {
      status: 200,
      description: "returns the array of the user's email",
      schema: {
        type: 'array',
        items: emailResponseSchema,
      },
    },
  })
  @Get(':userId/email')
  @Authorize(UserEmailReadSelfAuthorization)
  async get(@UserId() userId: string) {
    const emails = await this.userEmailService.findAllByUserId(userId);
    return this.userEmailService.format(emails);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Create a new email',
    },
    params: [userIdParamSchema],
    body: {
      schema: createEmailBodySchema,
    },
    response: {
      status: 201,
      description: 'returns the newly created email',
      schema: emailResponseSchema,
    },
    others: [
      ApiConflictResponse({
        description: 'Email already exists',
      }),
    ],
  })
  @Post(':userId/email')
  @Authorize(UserEmailCreateSelfAuthorization)
  async create(@UserId() userId: string, @Body() emailDto: CreateEmailDto) {
    const user = await this.userService._findById(userId);
    const email = await this.userEmailService.create(emailDto, user);

    return this.userEmailService.format(email);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Delete an email',
    },
    params: [userIdParamSchema, emailIdParamSchema],
    response: {
      status: 204,
      description: 'Returns no content',
    },
    others: [
      ApiNotFoundResponse({
        description: 'Email not found',
      }),
    ],
  })
  @Delete(':userId/email/:emailId')
  @HttpCode(204)
  @Authorize(UserEmailDeleteSelfAuthorize)
  delete(@Param('emailId') emailId: string) {
    return this._deleteById(emailId);
  }

  @ApiRoute({
    operation: {
      summary: 'Validate an email',
    },
    params: [tokenParamSchema],
    response: {
      status: 204,
      description: 'Returns no content',
    },
    others: [
      ApiNotFoundResponse({
        description: 'Token not found',
      }),
    ],
  })
  @Post('email/validate/:verificationToken')
  @HttpCode(204)
  validate(@Param('verificationToken') token: string) {
    return this.userEmailService.validateEmail(token);
  }

  @ApiRoute({
    operation: {
      summary:
        'Regenerate a verification token for an email and resend an email',
    },
    params: [emailIdParamSchema],
    response: {
      status: 204,
      description: 'Returns no content',
    },
    others: [
      ApiConflictResponse({
        description: 'Email was already verified.',
      }),
    ],
  })
  @Post('email/regenerate-token/:emailId')
  @HttpCode(204)
  async regenerateToken(@Param('emailId') emailId: string) {
    await this.userEmailService.regenerateValidationToken(emailId);
  }
}
