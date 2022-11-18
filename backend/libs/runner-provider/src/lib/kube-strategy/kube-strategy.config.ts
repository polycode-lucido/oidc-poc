import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import { RunnerOptions } from '../runner-provider.model';
import { RunnerLanguages } from '@polycode/runner-consumer';

export const validationSchema = Joi.object({
  RUNNER_TIMEOUT: Joi.number().default(15000),
  RUNNER_KUBE_PYTHON_IMAGE: Joi.string(),
  RUNNER_KUBE_RUST_IMAGE: Joi.string(),
  RUNNER_KUBE_JAVA_IMAGE: Joi.string(),
  RUNNER_KUBE_NODE_IMAGE: Joi.string(),
  RUNNER_KUBE_KUBECONFIG: Joi.string().optional(),
  RUNNER_KUBE_JOBS_NAMESPACE: Joi.string().default('polycode'),
});

export const registerer = registerAs('kube', (): RunnerOptions => {
  const images = [
    {
      image: process.env['RUNNER_KUBE_PYTHON_IMAGE'],
      language: RunnerLanguages.Python,
    },
    {
      image: process.env['RUNNER_KUBE_RUST_IMAGE'],
      language: RunnerLanguages.Rust,
    },
    {
      image: process.env['RUNNER_KUBE_JAVA_IMAGE'],
      language: RunnerLanguages.Java,
    },
    {
      image: process.env['RUNNER_KUBE_NODE_IMAGE'],
      language: RunnerLanguages.Node,
    },
  ];

  return {
    timeout: parseInt(process.env['RUNNER_TIMEOUT']),
    kube: {
      images,
      kubeconfig: process.env['RUNNER_KUBE_KUBECONFIG'],
      jobsNamespace: process.env['RUNNER_KUBE_JOBS_NAMESPACE'],
    },
  };
});
