import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { ComponentService } from '@polycode/component';
import { is404, to500 } from '@polycode/to';
import { Model, ObjectId } from 'mongoose';
import { Content, ContentDocument } from '@polycode/shared';
import { CreateContentDto } from './templates/dtos/create-content.dto';
import { UpdateContentDto } from './templates/dtos/update-content.dto';
import { OrderKeys } from '@polycode/request-helper';

@Injectable()
export class ContentService {
  constructor(
    @InjectModel(Content.name)
    private readonly contentModel: Model<ContentDocument>,
    private readonly componentService: ComponentService
  ) {}
  /**
   * Create a new content
   * @param createContentDto
   * @returns the created content
   */
  async create(createContentDto: CreateContentDto) {
    return await to500<Content>(
      (async () => {
        const rootComponent = await this.componentService.create(
          createContentDto.rootComponent
        );
        return this.contentModel.create({
          ...createContentDto,
          rootComponent,
        });
      })()
    );
  }

  /**
   * Find all contents, and populate the compoennts.
   * @param {number} offset - offset
   * @param {number} limit - limit
   * @param {Record<string, unknown>} findOptions - a mongo-like find object
   * @param {OrderKeys} order - a sorting object
   * @returns An array of ContentDocument objects.
   */
  async findAll(
    offset?: number,
    limit?: number,
    findOptions?: Record<string, unknown>,
    order?: OrderKeys
  ) {
    return await to500(
      this.contentModel
        .find(findOptions)
        .skip(offset)
        .limit(limit)
        .sort(order)
        .exec()
    );
  }

  /**
   * Get a content by id
   * @param id
   * @returns the content
   */
  async findOne(id: string) {
    return await is404<Content>(
      this.contentModel.findOne({ id }, { _id: 0, __v: 0 }).exec()
    );
  }

  /**
   * Update a content
   * @param id
   * @param updateContentDto
   * @returns the updated content
   */
  async update(id: string, updateContentDto: UpdateContentDto) {
    const model = await is404(this.contentModel.findOne({ id }).exec());

    if (
      updateContentDto.rootComponent.id &&
      model.rootComponent.id !== updateContentDto.rootComponent.id
    ) {
      throw new BadRequestException(
        'Cannot change root component to an existing one'
      );
    }

    if (updateContentDto.rootComponent.id) {
      updateContentDto.rootComponent = await this.componentService.update(
        updateContentDto.rootComponent.id,
        updateContentDto.rootComponent
      );
    } else {
      await this.componentService.remove(model.rootComponent.id);
      updateContentDto.rootComponent = await this.componentService.create(
        updateContentDto.rootComponent
      );
    }

    Object.assign(model, updateContentDto);
    return await to500(model.save());
  }

  /**
   * Delete a content
   * @param id
   */
  async remove(id: string) {
    const content = await is404(this.contentModel.findOne({ id }).exec());
    this.componentService.remove(content.rootComponent.id);
    return to500(content.remove());
  }

  /**
   * It removes the _id and __v properties from the content object and all of its children
   * @param {Content} content - Content - the content object that we want to remove the id and version
   * from
   * @returns The content object is being returned with the rootComponent property being set to the
   * return value of the removeIdAndVComponent function.
   */
  format(content: Content | Content[]) {
    if (Array.isArray(content)) {
      return content.map((c) => {
        return this.format(c);
      });
    }
    content.rootComponent = this.componentService.format(content.rootComponent);
    const json = content.toJSON();
    delete json._id;
    delete json.__v;
    return json;
  }

  /**
   * Convert an array of strings to an array of ObjectIds
   * @param {string[]} uuids - string[] - An array of uuids that you want to convert to ObjectIds
   * @returns An array of ObjectIds
   */
  async fromUuidToObjectId(uuids: string[]): Promise<ObjectId[]> {
    const promises = uuids.map((id) =>
      this.contentModel.findOne({ id }, { _id: 1 }).exec()
    );

    const modules = (await Promise.all(promises)).map(
      (content) => content._id as ObjectId
    );

    return modules;
  }
}
