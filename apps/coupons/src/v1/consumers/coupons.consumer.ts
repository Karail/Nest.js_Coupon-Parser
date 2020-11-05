import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';
//Services
import { CouponParseService } from '../services';
import {CouponsRequestService} from '../services/coupon-request.service'
// Interfaces
import { JobCouponsParseInterface as  JobCouponsParse, JobCouponsRequestInterface as JobCouponsRequest } from '../interfaces';
import { JobResult } from '../../../../shared/interfaces';
// Consumers
import { BaseConsumer } from '../../../../shared/consumers/base.consumer';

// Jobs
export const COUPONS_PARSE = 'coupons-parse';
export const COUPONS_REQUEST = 'coupons-request';

@Processor(`${process.env.REDIS_PREFIX}-coupons`)
export class CouponsConsumer extends BaseConsumer {
  constructor(
    private readonly couponsRequestService: CouponsRequestService,
    private readonly couponParseService: CouponParseService,
  ) {
    super();
  }

  /**
   * coupon parse job
   * @param job
   *
   * @return {JobResult} return standard job response
   */
  @Process({ name: COUPONS_PARSE, concurrency: 12 })
  private parse(job: Job<JobCouponsParse>): Promise<JobResult> {
    return this.couponParseService.parse(job.data);
  }
  /**
   * coupons request job
   * @param job
   *
   * @return {JobResult} return standard job response
   */
  @Process({ name: COUPONS_REQUEST, concurrency: 12 })
  private request(job: Job<JobCouponsRequest>): Promise<JobResult> {
    return this.couponsRequestService.request(job.data);
  }
}
