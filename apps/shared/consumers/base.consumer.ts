import { OnQueueActive, OnQueueCompleted, OnQueueError } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { Job } from 'bull';
//Interfaces
import { JobResult } from '../interfaces';

export class BaseConsumer {
    @OnQueueError()
    onError(job: Job) {
        const { duration, error } = job.returnvalue as JobResult;
        Logger.error(`Job ${job.id} finished with error, duration ${duration?.[0]}s  ${duration?.[1] / 1000000}ms`, error, 'BaseConsumer.onError');
    }

    @OnQueueActive()
    onActive(job: Job) {
        Logger.log(`Processing job ${job.id} of type ${job.name}`, 'BaseConsumer.onActive');
    }

    @OnQueueCompleted()
    async onCompleted(job: Job) {
        const { duration } = job.returnvalue as JobResult;
        Logger.log(`Job ${job.id} finished, duration ${duration?.[0]}s ${duration?.[1] / 1000000}ms`, 'BaseConsumer.onCompleted');
    }
}