import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import {
  runnerLanguagesSettings,
  RunnerLanguagesSettings,
} from '@polycode/runner-consumer';
import * as Docker from 'dockerode';
import { Stream } from 'stream';
import { RunnerOptions } from '../runner-provider.model';

/**
 * It pulls the docker images for the languages that are supported by the runner.
 * It is also responsible for creating the docker instance that will be used in the service
 * @param {RunnerOptions} options - RunnerOptions - the options passed to the runner
 * @returns A function that returns a promise.
 */
export async function imagesProvidersFactory(options: RunnerOptions) {
  const images: RunnerLanguagesSettings[] = runnerLanguagesSettings;
  try {
    const dockerInstance = new Docker();
    if (!dockerInstance.ping()) {
      throw new Error('Docker is not available');
    }

    const optionsImages = options?.docker?.images;

    if (optionsImages) {
      optionsImages.forEach((image) => {
        const imageFound = images.find(
          (i) => i.language === image.language && !i.version
        );
        if (!imageFound) {
          Logger.error(
            `Language ${image.language} is not supported`,
            'DockerStrategyProvider'
          );
        } else {
          if (image.image) {
            imageFound.image = image.image;
          }
        }
      });
    }

    const promises: Promise<void>[] = images.map(async (image) => {
      return new Promise((resolve, reject) => {
        Logger.log(
          `Pulling image ${image.image} for ${image.language}`,
          'DockerStrategyProvider'
        );
        dockerInstance.pull(image.image, (err, stream: Stream) => {
          if (err) {
            Logger.error(err);
            reject(err);
          }
          stream.addListener('data', (data) => {
            Logger.log(
              data
                .toString()
                .trim()
                .replace('"}', '')
                .replace('{"status":"', '')
                .replace('"\n', ''),
              'DockerStrategyService ' + image.language.toString().toUpperCase()
            );
          });
          stream.addListener('end', () => {
            Logger.log(
              `Pull for ${image.image} for ${image.language} is done`,
              'DockerStrategyService ' + image.language.toString().toUpperCase()
            );
            resolve(null);
          });
        });
      });
    });

    await Promise.all(promises);

    return {
      ...options,
      docker: { ...options.docker, images: images, docker: dockerInstance },
    };
  } catch (err: unknown) {
    Logger.error(err, 'DockerStrategyProvider');
  }
}

export async function imagesProvidersFactoryAsync(
  configService: ConfigService
) {
  return await imagesProvidersFactory(
    configService.get<RunnerOptions>('docker')
  );
}
