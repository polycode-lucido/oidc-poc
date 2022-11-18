import {
  BadRequestException,
  Body,
  Controller,
  InternalServerErrorException,
  Post,
} from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiRoute } from '@polycode/docs';
import { RunnerLanguages, RunnerWorkload } from '@polycode/runner-consumer';
import { RunnerProviderService } from './runner-provider.service';

@Controller()
@ApiTags('Runner')
export class RunnerProviderController {
  constructor(private readonly runnerProviderService: RunnerProviderService) {}

  @Post('run')
  @ApiRoute({
    operation: {
      summary: 'Runs a workload',
      description: 'Runs a workload',
    },
    body: {
      schema: {
        type: 'object',
        required: ['sourceCode', 'language'],
        properties: {
          sourceCode: {
            type: 'string',
            description: 'Source code of the workload',
          },
          settings: {
            type: 'object',
            required: ['language'],
            description: 'Language settings of the workload',
            properties: {
              language: {
                type: 'string',
                enum: Object.values(RunnerLanguages),
                description: 'Language of the workload',
              },
              version: {
                type: 'string',
                description: 'Version of the language',
              },
              image: {
                type: 'string',
                description: 'Image to use for the language',
              },
            },
          },
        },
      },
    },
  })
  async run(@Body() body: RunnerWorkload) {
    try {
      return await this.runnerProviderService.run(
        body.sourceCode,
        body.settings,
        body.stdin
      );
    } catch (error) {
      if (
        (error?.message as string).match(
          /Language .* for version .* is not supported/g
        )
      ) {
        throw new BadRequestException(error.message);
      }
      throw new InternalServerErrorException(error?.message);
    }
  }
}
