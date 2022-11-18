import { Module } from './module.entity';
import { Component } from './component.entity';
import { Content } from './content.entity';
import { Validator } from './validator.entity';

export * from './validator.entity';
export * from './content.entity';
export * from './component.entity';
export * from './module.entity';

export const mongooseModuleModels = [Component, Content, Validator, Module];
