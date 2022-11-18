import { Inject, Injectable, Logger } from '@nestjs/common';
import {
  RunnerExecutionResults,
  RunnerLanguagesSettings,
} from '@polycode/runner-consumer';
import {
  RunnerOptions,
  RunnerProvider,
  RUNNER_OPTIONS,
} from '../runner-provider.model';
import * as k8s from '@kubernetes/client-node';
import { RunnerJob } from './models/runner-job.model';

@Injectable()
export class KubeStrategyService implements RunnerProvider {
  private timeout = 15000;
  private images: RunnerLanguagesSettings[];
  private kubeconfig: k8s.KubeConfig;
  private jobsNamespace = 'runner';

  private coreApi: k8s.CoreV1Api;
  private batchApi: k8s.BatchV1Api;
  private watchApi: k8s.Watch;

  constructor(
    @Inject(RUNNER_OPTIONS) private readonly runnerOptions: RunnerOptions
  ) {
    this.images = this.runnerOptions.kube.images;
    if (this.runnerOptions.kube.kubeconfig) {
      this.kubeconfig = new k8s.KubeConfig();
      this.kubeconfig.loadFromString(this.runnerOptions.kube.kubeconfig);
    }
    if (this.runnerOptions.timeout) {
      this.timeout = this.runnerOptions.timeout;
    }
    if (this.runnerOptions.kube.jobsNamespace) {
      this.jobsNamespace = this.runnerOptions.kube.jobsNamespace;
    }
    this.coreApi = runnerOptions.kube.apis.core;
    this.batchApi = runnerOptions.kube.apis.batch;
    this.watchApi = runnerOptions.kube.apis.watch;
    Logger.log(`Initialized`, `KubeStrategyService`);
  }

  /**
   * It creates a Kubernetes Job that execute code in a container and return the execution results
   * @param sourceCode - Source code to run
   * @param languageSettings - Language settings
   * @param stdin - Stdin to pass to the program
   * @returns a promise that resolves to an object with the RunnerExecutionResults properties
   */
  async run(
    sourceCode: string,
    languageSettings: RunnerLanguagesSettings,
    stdin: string[] = []
  ): Promise<RunnerExecutionResults> {
    try {
      const image = this.images.find(
        (image) =>
          image.language === languageSettings.language &&
          image.version === languageSettings.version
      );

      if (!image) {
        throw new Error(
          `Language ${languageSettings.language} for version ${languageSettings.version} is not supported`
        );
      }

      const job = new RunnerJob(image, sourceCode, stdin);

      await this.batchApi.createNamespacedJob(this.jobsNamespace, job);

      Logger.log(
        `Runner execution started with image ${image.image} on job ${job.metadata.name}`,
        `KubeStrategyService`
      );

      return await this.waitExecution(job.metadata.name, image.image);
    } catch (error) {
      Logger.error(error);
      throw new Error(error);
    }
  }

  /**
   * It waits for the execution of a job and returns the execution results
   * @param jobName - Job name
   * @returns a promise that resolves to an object with the RunnerExecutionResults properties
   */
  private waitExecution(jobName: string, image: string) {
    return new Promise<RunnerExecutionResults>((resolve, reject) => {
      this.watchApi
        .watch(
          `/apis/batch/v1/namespaces/${this.jobsNamespace}/jobs`,
          {},
          async (type, apiObj) => {
            //Watch for the right finished job
            if (
              type === 'MODIFIED' &&
              apiObj.metadata.name === jobName &&
              (apiObj.status.succeeded || apiObj.status.failed)
            ) {
              try {
                //Catch the pod created by the job
                const createdPod = (
                  await this.coreApi.listNamespacedPod(this.jobsNamespace)
                ).body.items.find((pod) => {
                  return pod.metadata.labels['job-name'] == jobName;
                });

                //Get the pod status to extract the exit code
                const createdPodStatus =
                  await this.coreApi.readNamespacedPodStatus(
                    createdPod.metadata.name,
                    this.jobsNamespace
                  );

                //Get the pod logs
                const logs = await this.coreApi.readNamespacedPodLog(
                  createdPod.metadata.name,
                  this.jobsNamespace
                );

                Logger.log(
                  `Runner execution finished with image ${image} on job ${jobName}`,
                  `KubeStrategyService`
                );

                //Parse and send execution result
                resolve({
                  stdout: logs.body.match(
                    /\$::stdout::\$\n([\s\S]*?)\$::end::\$/
                  )[1],
                  stderr: logs.body.match(
                    /\$::stderr::\$\n([\s\S]*?)\$::end::\$/
                  )[1],
                  exitCode:
                    createdPodStatus.body.status.containerStatuses[0].state
                      .terminated.exitCode,
                });
              } catch (error) {
                reject(error);
              } finally {
                //Delete the job
                await this.batchApi.deleteNamespacedJob(
                  jobName,
                  this.jobsNamespace,
                  undefined,
                  undefined,
                  undefined,
                  undefined,
                  'Background'
                );
              }
            }
          },
          (err) => {
            reject(err);
          }
        )
        .then((req) => {
          setTimeout(() => {
            req.abort();
            resolve({
              exitCode: -128,
              stderr: `Execution timed out : ${this.timeout / 1000} seconds`,
              stdout: '',
            });
          }, this.timeout);
        });
    });
  }
}
