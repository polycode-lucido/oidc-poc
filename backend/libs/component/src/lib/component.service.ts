import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { is404, to500 } from '@polycode/to';
import { ValidatorService } from '@polycode/validator';
import { Model } from 'mongoose';
import { Component, ComponentDocument } from '@polycode/shared';
import { CreateComponentDto } from './template/dtos/create-component.dto';
import { UpdateComponentDto } from './template/dtos/update-component.dto';

@Injectable()
export class ComponentService {
  constructor(
    @InjectModel(Component.name)
    private componentModel: Model<ComponentDocument>,
    private validatorService: ValidatorService
  ) {}

  /**
   * Creates a new component document in the database
   * @param {CreateComponentDto} createComponentDto - CreateComponentDto
   * @returns A ComponentDocument
   */
  async create(createComponentDto: CreateComponentDto) {
    return await to500<Component>(
      (async () => {
        if (createComponentDto.data) {
          if (createComponentDto.data.components) {
            createComponentDto.data.components = await Promise.all(
              createComponentDto.data.components.map(async (component) => {
                return await this.create(component);
              })
            );
          }

          if (createComponentDto.data.validators) {
            createComponentDto.data.validators = await Promise.all(
              createComponentDto.data.validators.map(async (validator) => {
                return await this.validatorService.create(validator);
              })
            );
          }
        }

        return await this.componentModel.create(createComponentDto);
      })()
    );
  }

  /**
   * It takes an id and an updateComponentDto, and returns
   * a promise that resolves to a ComponentDocument or throw a 404 error
   * @param {string} id - string - The id of the component to update
   * @param {UpdateComponentDto} updateComponentDto - UpdateComponentDto
   * @returns The updated component
   */
  async update(id: string, updateComponentDto: UpdateComponentDto) {
    const model = await is404(this.componentModel.findOne({ id }).exec());

    if (updateComponentDto.data?.components) {
      /* for each subcomponents of the dto, we check if it exists in the model
         if not we create it
         if it exists, we update it
         if it has an id is not in the current model, we throw an error */
      updateComponentDto.data.components = await Promise.all(
        updateComponentDto.data.components.map((component) => {
          if (!component.id) {
            return this.create(component);
          } else {
            if (model.data.components.find((c) => c.id === component.id)) {
              return this.update(component.id, component);
            } else {
              throw new BadRequestException(
                `Cannot add component with id ${component.id}`
              );
            }
          }
        })
      );
    }

    /* We delete the components that are in the model but not in the dto, since they will be unlinked from the model */
    model.data?.components?.forEach(async (c) => {
      const found = updateComponentDto.data.components.find(
        (c2) => c2.id === c.id
      );
      if (!found) {
        await this.remove(c.id);
      }
    });

    // Same thing with validators
    if (updateComponentDto.data?.validators) {
      updateComponentDto.data.validators = await Promise.all(
        updateComponentDto.data.validators.map(async (validator) => {
          if (!validator.id) {
            return await this.validatorService.create(validator);
          } else {
            if (model.data.validators.find((c) => c.id === validator.id)) {
              return await this.validatorService.update(
                validator.id,
                validator
              );
            } else {
              throw new BadRequestException(
                `Cannot find validator with id ${validator.id} for this component`
              );
            }
          }
        })
      );
    }

    model.data?.validators?.forEach(async (c) => {
      const found = updateComponentDto.data.validators.find(
        (c2) => c2.id === c.id
      );
      if (!found) {
        await this.validatorService.remove(c.id);
      }
    });

    Object.assign(model, updateComponentDto);

    await to500(model.save());
    return model;
  }

  /**
   * Find one component by his uuid
   * return a promise that resolves to a ComponentDocument or throw a 404 error
   * @param {string} id - string - The id of the component to update
   * @returns The component
   */
  async findOne(id: string): Promise<Component> {
    return await is404(this.componentModel.findOne({ id }).exec());
  }

  /**
   * Find a component by its object id and return it if it exists, otherwise return a 404 error.
   *
   * The `is404` function is a helper function that returns a 404 error if the given object is null
   * @param _id - The id of the component to find
   * @returns The component with the given id.
   */
  async findByObjectId(_id) {
    return await is404<Component>(
      this.componentModel.findById(_id, { _id: 0 }).exec()
    );
  }

  /**
   * Find one component by his uuid and populate all validators in data.validators
   * return a promise that resolves to a ComponentDocument or throw a 404 error
   * @param {string} id - string - The id of the component to update
   * @returns The component with all his validators inside
   */
  async findOnePopulateValidators(id: string): Promise<Component> {
    const component = await is404(this.componentModel.findOne({ id }).exec());
    this.populateValidators(component);
    return component;
  }

  private async deleteChildren(parent: Component) {
    if (parent.data?.components) {
      parent.data?.components?.forEach(async (child) => {
        try {
          await this.remove(child.id);
        } catch (e) {
          // Does nothing, errors may happens if the children are already deleted, you can ignore it
        }
      });
    }
  }

  /**
   * It removes a component from the database
   * @param {string} id - string - The id of the component to remove
   */
  async remove(id: string) {
    const component = await is404(this.componentModel.findOne({ id }).exec());
    try {
      await this.deleteChildren(component);
      component.data?.validators?.forEach(
        async (v) => await this.validatorService.remove(v.id)
      );
      return await component.delete();
    } catch (e) {
      // Does nothing, errors may happens if the children are already deleted, you can ignore it
    }
  }

  /**
   * Populate validator in the component.
   * @param {Component} component - The component to populate
   * @returns Nothing , validators are added directly to the component
   */
  async populateValidators(component: Component) {
    if (component?.data?.validators) {
      component.data.validators = (
        await Promise.all(
          component.data.validators.map(async (validatorId) => {
            try {
              return await this.validatorService.findByObjectId(validatorId);
            } catch (e) {
              return null;
            }
          })
        )
      )
        // when a validator is not found it return null, so we remove it from the array
        .filter(Boolean);
    }
  }

  /**
   * It removes the MongoDB _id and __v properties from the component and its children
   * @param {Component | Component[]} component - The component to format.
   * @returns The component is being returned.
   */
  format(component: Component | Component[]) {
    if (Array.isArray(component)) {
      return component.map((c) => this.format(c));
    } else {
      try {
        delete component._id;
        delete component.__v;
      } catch (e) {
        // Expected error
      }
      if (component && component.data) {
        if (component.data.components) {
          component.data.components = component.data?.components?.map((c) =>
            this.format(c)
          );
        }
        if (component.data.validators) {
          component.data.validators = component.data?.validators?.map((v) =>
            this.validatorService.format(v)
          );
        }
      }
      return component;
    }
  }
}
