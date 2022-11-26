import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Subject } from '@polycode/decorator';
import { submissionBodySchema } from './templates/schema/body/submission.body.schema';
import { submissionResponseSchema } from './templates/schema/response/submission.response.schema';
import { lastAttemptResponseSchema } from './templates/schema/response/lastAttempt.response.schema';
import { SubmissionDTO } from './templates/dtos/submission.dto';
import { ApiRouteAuthenticated } from '@polycode/docs';
import { SubmissionService } from './submission.service';
import { submissionOneBodySchema } from './templates/schema/body/submissionOne.body.schema';
import { submissionOneResponseSchema } from './templates/schema/response/submissionOne.response.schema';
import { SubmissionOneDTO } from './templates/dtos/submissionOne.dto';
import { Resource, Scopes } from 'nest-keycloak-connect';

@ApiTags('Submission')
@Controller('submission')
@Resource('submission')
export class SubmissionController {
  constructor(private readonly submissionService: SubmissionService) {}

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Get last attempt and last success',
      description:
        'Get best and last attempts  if the user has completed the component',
    },
    response: {
      status: 200,
      description: 'Returns attempts',
      schema: lastAttemptResponseSchema,
    },
  })
  @Get('/:componentId')
  @Scopes('read')
  async getSubmissions(
    @Subject('internalIdentifier') userId: string,
    @Param('componentId') componentId: string
  ) {
    return await this.submissionService.getSubmission(userId, componentId);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Submit a code',
      description:
        'Submit a code, calls a runner to execute it and check the result with the validators of the component',
    },
    body: {
      schema: submissionBodySchema,
    },
    response: {
      status: 200,
      description: "Returns the result of the code's execution",
      schema: submissionResponseSchema,
    },
  })
  @Post()
  @Scopes('create')
  async submit(
    @Body() submissionDTO: SubmissionDTO,
    @Subject('internalIdentifier') userId: string
  ) {
    return await this.submissionService.submit(userId, submissionDTO);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Submit a code and test it with one validator',
      description:
        'Submit a code, calls a runner to execute it and check the result with the validator',
    },
    body: {
      schema: submissionOneBodySchema,
    },
    response: {
      status: 200,
      description: "Returns the result of the code's execution",
      schema: submissionOneResponseSchema,
    },
  })
  @Post('/:validatorId')
  @Scopes('write')
  async submitOne(
    @Body() submissionDTO: SubmissionOneDTO,
    @Param('validatorId') validatorId: string
  ) {
    return await this.submissionService.submitOne(validatorId, submissionDTO);
  }
}
