import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { RunnerOptions } from '../runner-provider.model';
import { RunnerLanguages } from '@polycode/runner-consumer';

export const validationSchema = Joi.object({
  RUNNER_TIMEOUT: Joi.number().default(15000),
  RUNNER_DOCKER_PYTHON_IMAGE: Joi.string(),
  RUNNER_DOCKER_RUST_IMAGE: Joi.string(),
  RUNNER_DOCKER_JAVA_IMAGE: Joi.string(),
  RUNNER_DOCKER_NODE_IMAGE: Joi.string(),
});

export const registerer = registerAs('docker', (): RunnerOptions => {
  const images = [
    {
      image: process.env['RUNNER_DOCKER_PYTHON_IMAGE'],
      language: RunnerLanguages.Python,
    },
    {
      image: process.env['RUNNER_DOCKER_RUST_IMAGE'],
      language: RunnerLanguages.Rust,
    },
    {
      image: process.env['RUNNER_DOCKER_JAVA_IMAGE'],
      language: RunnerLanguages.Java,
    },
    {
      image: process.env['RUNNER_DOCKER_NODE_IMAGE'],
      language: RunnerLanguages.Node,
    },
  ];

  return {
    timeout: parseInt(process.env['RUNNER_TIMEOUT']),
    docker: {
      images,
    },
  };
});
