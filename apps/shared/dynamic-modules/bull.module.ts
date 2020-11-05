import { DynamicModule, Logger } from '@nestjs/common';
import { BullModule, BullModuleOptions } from '@nestjs/bull';
import { DoneCallback, Job } from 'bull';

/**
 * Bull module register function
 * @param {string} queueName Bull queue name
 * @returns {Promise<DynamicModule>} Result will be a NestJs Dynamic Module with Bull options
 */
export const bullQueueModule = async (queueName: string): Promise<DynamicModule> => {
  const bullModule = await BullModule.registerQueueAsync(
    {
      name: queueName,
      useFactory: (): BullModuleOptions => ({
        defaultJobOptions: {
          attempts: 5,
          backoff: {
            type: 'fixed',
            delay: 1500
          },
          removeOnComplete: 10,
          removeOnFail: 30,
        },
        redis: {
          host: process.env.REDIS_HOST,
          port: Number(process.env.REDIS_PORT),
          retryStrategy(times: number): number | void | null {
            return Math.min(times * 50, 2000);
          },
        },
        processors: [
          (job: Job, done: DoneCallback) => {
            done(null, job.data);
          },
        ],
      }),
    },
  );

  Logger.log(`Register bullModule for queue ${queueName}`, 'BullModule');
  return bullModule;
};
