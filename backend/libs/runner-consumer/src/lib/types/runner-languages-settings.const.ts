import { RunnerLanguagesSettings } from './runner-languages-settings.interface';
import { RunnerLanguages } from './runner-languages.enum';

export const runnerLanguagesSettings: RunnerLanguagesSettings[] = [
  {
    language: RunnerLanguages.Node,
    version: '16',
    image: 'node:16',
  },
  {
    language: RunnerLanguages.Node,
    version: '18',
    image: 'node:18',
  },
  {
    language: RunnerLanguages.Node,
    image: 'node:latest',
  },
  {
    language: RunnerLanguages.Python,
    version: '3.9',
    image: 'python:3.9',
  },
  {
    language: RunnerLanguages.Python,
    image: 'python:latest',
  },
  {
    language: RunnerLanguages.Java,
    version: '17',
    image: 'openjdk:17-jdk',
  },
  {
    language: RunnerLanguages.Java,
    image: 'openjdk:latest',
  },
  {
    language: RunnerLanguages.Rust,
    version: '1.60',
    image: 'rust:1.60',
  },
  {
    language: RunnerLanguages.Rust,
    image: 'rust:latest',
  },
];
