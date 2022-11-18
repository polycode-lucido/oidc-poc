import { Logger } from '@nestjs/common';
import {
  runnerLanguagesSettings,
  RunnerLanguagesSettings,
} from '@polycode/runner-consumer';
import { RunnerOptions } from '../runner-provider.model';
import * as k8s from '@kubernetes/client-node';
import { ConfigService } from '@nestjs/config';

export async function imagesProvidersFactory(options: RunnerOptions) {
  const images: RunnerLanguagesSettings[] = runnerLanguagesSettings;
  const optionsImages = options?.kube?.images;

  if (optionsImages) {
    optionsImages.forEach((image) => {
      const imageFound = images.find(
        (i) => i.language === image.language && !i.version
      );
      if (!imageFound) {
        Logger.error(
          `Language ${image.language} is not supported`,
          'KubeStrategyProvider'
        );
      } else {
        if (image.image) {
          imageFound.image = image.image;
        }
      }
    });
  }

  const kubeconfig = new k8s.KubeConfig();
  if (options?.kube?.kubeconfig) {
    kubeconfig.loadFromString(options.kube.kubeconfig);
  } else {
    kubeconfig.loadFromDefault();
  }
  const coreApi = kubeconfig.makeApiClient(k8s.CoreV1Api);
  const batchApi = kubeconfig.makeApiClient(k8s.BatchV1Api);
  const watchApi = new k8s.Watch(kubeconfig);

  return {
    ...options,
    kube: {
      ...options.kube,
      images,
      apis: { core: coreApi, batch: batchApi, watch: watchApi },
    },
  } as RunnerOptions;
}

export async function imagesProvidersFactoryAsync(
  configService: ConfigService
) {
  return await imagesProvidersFactory(configService.get<RunnerOptions>('kube'));
}
