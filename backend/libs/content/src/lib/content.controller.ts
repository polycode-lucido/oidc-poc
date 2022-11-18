import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { ApiNotFoundResponse, ApiTags } from '@nestjs/swagger';
import { Authorize } from '@polycode/auth-consumer';
import { ApiRouteAuthenticated } from '@polycode/docs';
import { QueryOptions } from '@polycode/query-manager';
import { ContentService } from './content.service';
import { CreateContentDto } from './templates/dtos/create-content.dto';
import { UpdateContentDto } from './templates/dtos/update-content.dto';
import {
  ContentCreateAuthorization,
  ContentDeleteOneAuthorize,
  ContentReadAllAuthorize,
  ContentReadOneAuthorize,
  ContentReadUpdateOneAuthorize,
} from './templates/policies';
import { createBodySchema } from './templates/schemas/body/content.body.create.schema';
import { patchBodySchema } from './templates/schemas/body/content.body.patch.schema';
import { contentIdParamSchema } from './templates/schemas/params/content.param.schema';
import { contentResponseSchema } from './templates/schemas/response/content.response.schema';

@Controller('content')
@ApiTags('Content')
export class ContentController {
  constructor(private readonly contentService: ContentService) {}

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Register/Create a new content',
    },
    body: {
      schema: createBodySchema,
    },
    response: {
      status: 201,
      description: 'Returns the created content',
      schema: contentResponseSchema,
    },
  })
  @Post()
  @Authorize(ContentCreateAuthorization)
  async create(@Body() createContentDto: CreateContentDto) {
    return this.contentService.format(
      await this.contentService.create(createContentDto)
    );
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Find all contents',
    },
    response: {
      status: 200,
      description: 'Returns all contents',
      schema: {
        type: 'array',
        items: contentResponseSchema,
      },
    },
    pagination: true,
    order: {
      enable: true,
      keys: {
        name: null,
        reward: null,
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
  @Authorize(ContentReadAllAuthorize)
  async findAll(@Req() request: QueryOptions) {
    const filter = {
      ...Object.keys(request?.filter?.keys || []).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...(request?.filter?.keys[key].matching
              ? {
                  $regex: request?.filter?.keys[key].value,
                }
              : {
                  $eq: request?.filter?.keys[key].value,
                }),
          },
        }),
        {}
      ),
      ...Object.keys(request?.filter?.arrays || []).reduce(
        (acc, key) => ({
          ...acc,
          [key]: {
            ...(request?.filter?.arrays[key].containsAll
              ? {
                  $all: request?.filter?.arrays[key].value
                    .slice(1, -1)
                    .split(','),
                }
              : {
                  $in: request?.filter?.arrays[key].value
                    .slice(1, -1)
                    .split(','),
                }),
          },
        }),
        {}
      ),
    };

    const contents = await this.contentService.findAll(
      request?.pagination?.offset,
      request?.pagination?.limit,
      filter,
      request?.order?.keys
    );

    return this.contentService.format(contents);
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Find a content by id',
    },
    params: [contentIdParamSchema],
    response: {
      status: 200,
      description: 'Returns the content',
      schema: contentResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'Content not found',
      }),
    ],
  })
  @Get(':contentId')
  @Authorize(ContentReadOneAuthorize)
  async findOne(@Param('contentId') id: string) {
    return this.contentService.format(await this.contentService.findOne(id));
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Update a content',
    },
    params: [contentIdParamSchema],
    body: {
      schema: patchBodySchema,
    },
    response: {
      status: 200,
      description: 'Returns the updated content',
      schema: contentResponseSchema,
    },
    others: [
      ApiNotFoundResponse({
        description: 'Content not found',
      }),
    ],
  })
  @Put(':contentId')
  @Authorize(ContentReadUpdateOneAuthorize)
  async update(
    @Param('contentId') id: string,
    @Body() updateContentDto: UpdateContentDto
  ) {
    return this.contentService.format(
      await this.contentService.update(id, updateContentDto)
    );
  }

  @ApiRouteAuthenticated({
    operation: {
      summary: 'Delete a content',
    },
    params: [contentIdParamSchema],
    response: {
      status: 204,
      description: 'Returns no content',
    },
    others: [
      ApiNotFoundResponse({
        description: 'Content not found',
      }),
    ],
  })
  @Delete(':contentId')
  @Authorize(ContentDeleteOneAuthorize)
  @HttpCode(204)
  async remove(@Param('contentId') id: string) {
    return this.contentService.remove(id);
  }
}
