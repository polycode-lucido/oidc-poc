import {
  RunnerExecutionResults,
  RunnerLanguagesSettings,
} from '@polycode/runner-consumer';
import Dockerode from 'dockerode';
import * as k8s from '@kubernetes/client-node';

export const RUNNER_OPTIONS = 'RunnerOptions';

/* Interface every runner strategies service must implement */
export interface RunnerProvider {
  run(
    sourceCode: string,
    strategy: RunnerLanguagesSettings,
    stdin: string[]
  ): Promise<RunnerExecutionResults>;
}

/* Options that can be set for all the execution strategies. */
export interface RunnerOptions {
  docker?: {
    images?: RunnerLanguagesSettings[];
    docker?: Dockerode;
  };
  kube?: {
    images?: RunnerLanguagesSettings[];
    kubeconfig?: string;
    jobsNamespace?: string;
    apis?: {
      core?: k8s.CoreV1Api;
      batch?: k8s.BatchV1Api;
      watch?: k8s.Watch;
    };
  };
  timeout?: number;
}
