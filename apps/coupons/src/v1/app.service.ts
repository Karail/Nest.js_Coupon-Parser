import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, JobOptions, Queue } from 'bull';
import { InjectEventEmitter } from 'nest-emitter';
import { CronExpression } from '@nestjs/schedule';
// Services
import { MailService } from './services';
// Emitters
import { AppEvents, AppEventsEmitter } from './app.events';
// Jobs
import { COUPONS_REQUEST } from './consumers/coupons.consumer';
import { DECODE_DEEPLINK } from 'apps/decode-deep-link/src/consumers/decode-deep-link.consumer';
// Interfaces
import { JobCouponsRequestInterface as JobCouponsRequest } from './interfaces';
import { JobDecodeDeepLinkInterface as JobDecodeDeepLink } from 'apps/decode-deep-link/src/interfaces/queue.interface';
//Utils
import { getRandomInt } from 'apps/shared/utils';

@Injectable()
export class AppService implements OnModuleInit {
  constructor(
    @InjectQueue(`${process.env.REDIS_PREFIX}-coupons`) private readonly couponsQueue: Queue,
    @InjectQueue(`${process.env.REDIS_PREFIX}-decode-deep-link`) private readonly deepLinkDecodeQueue: Queue,
    @InjectEventEmitter() private readonly emitter: AppEventsEmitter,
    private readonly mailService: MailService,
  ) { }

  public async onModuleInit(): Promise<void> {
    // Parse coupons for 7days
    await this.parseCouponByPlatform({
      platformSlug: '7days',
      titleLang:'rus',
      active: false
    }, {
      repeat: {
        cron: CronExpression.EVERY_10_MINUTES,
      },
    });

    await this.initEmitters();
  }

  /**
   * Add coupon parsing job by platforms
   * @param {JobCouponsRequest} platformSlug, titleLang, active
   * @param {JobOptions} jobOptions job option object
   * @private
   */
  private async parseCouponByPlatform(jobParams: JobCouponsRequest, jobOptions: JobOptions): Promise<void> {
    try {
      const job: Job<JobCouponsRequest> = await this.couponsQueue.add(
        COUPONS_REQUEST,
        jobParams,
        jobOptions
      );
      Logger.log(`Added new job for coupon request ${job.id}`, 'AppService.initQueues');
    } catch (e) {
      Logger.error('queue error', e, 'AppService.initQueues');
    }
  }

  /**
   * init emitters
   */
  private initEmitters(): void {
    this.emitter.on(
      'notRetailer',
      async (msg) => await this.mailService.send(msg),
    );
    this.emitter.on(
      'decodeDeeplink',
      async (documentOptions) => await this.updateDeeplink(documentOptions),
    );
  }

  /**
   * add queue DECODE_DEEPLINK
   * @param options
   * @returns job
   */
  private async updateDeeplink(documentOptions: AppEvents['decodeDeeplink']): Promise<void> {
    try {
      const job: Job<JobDecodeDeepLink> = await this.deepLinkDecodeQueue.add(
        DECODE_DEEPLINK,
        documentOptions,
        { delay: getRandomInt(1000, 4000) }
      );
      Logger.log(`Added new job for decode-deep-link with id ${job.id}`);
    } catch (e) {
      Logger.error('queue error', e, 'AppService.updateDeeplink');
      throw Error(e);
    }
  }
}
