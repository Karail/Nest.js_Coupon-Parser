import { Injectable, Logger } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Job, Queue } from 'bull';
import fetch from 'node-fetch';
import { parseString } from 'xml2js';
// Interfaces
import {
    JobCouponsParseInterface as JobCouponsParse,
    JobCouponsRequestInterface as JobCouponsRequest,
} from '../interfaces';
import { JobResult } from '../../../../shared/interfaces';
//Dto
import {
    NoParsedAdmitadCouponsDto as NoParsedAdmitadCoupons,
} from '../dto';
//Jobs
import { COUPONS_PARSE } from '../consumers/coupons.consumer';
//Services
import { PlatformService } from './platform.service';

@Injectable()
export class CouponsRequestService {
    constructor(
        @InjectQueue(`${process.env.REDIS_PREFIX}-coupons`) private readonly couponsQueue: Queue,
        private readonly platformService: PlatformService
    ) { }

    /**
     * Create job for coupon parsing
     * @param {JobCouponsRequest} jobData
     *
     * @return {JobResult} return standard job response
     */
    public async request(jobData: JobCouponsRequest): Promise<JobResult> {
        const hrStart = process.hrtime();
        try {
            const { platformSlug, titleLang } = jobData;
            const { _id: platformId, affiliateUrls } = await this.platformService.findOne({ slug: platformSlug });

            const url = affiliateUrls[0];
            const response = await fetch(url);
            const data = await response.text();

            parseString(data, async (err, result: NoParsedAdmitadCoupons) => {
                if (err) {
                    throw err;
                }
                for (const coupon of result.admitad_coupons.coupons[0].coupon) {
                    const advcampaign = result.admitad_coupons.advcampaigns[0].advcampaign
                        .find((el) => el.$.id === coupon.advcampaign_id[0]);

                    const job: Job<JobCouponsParse> = await this.couponsQueue.add(COUPONS_PARSE, {
                        options: {
                            titleLang,
                            platformId
                        },
                        coupon,
                        advcampaign,
                    });

                    Logger.log(`Coupon successful added to coupons parse queue with job id ${job.id}`, 'CouponsRequestService.request')
                }
                return {
                    duration: process.hrtime(hrStart),
                    message: 'Coupon successful added to coupons queue',
                    error: null
                }
            });
        } catch (e) {
            Logger.error('Coupons request error', e, 'CouponsRequestService.request');

            return {
                duration: process.hrtime(hrStart),
                error: e.message
            }
        }
    }
}
