import { Injectable, Logger } from '@nestjs/common';
import { DeepLinkService } from 'deeplink-module';
//Services
import { CouponService } from '../../../coupons/src/v1/services/coupon.service';
//Interfaces
import { JobResult } from '../../../shared/interfaces';
import { JobDecodeDeepLinkInterface as JobDecodeDeepLink } from '../interfaces/queue.interface';

@Injectable()
export class DecodeDeepLinkService {
  constructor(
    private readonly couponService: CouponService,
    private readonly deepLinkService: DeepLinkService,
  ) {
  }

  /**
   * Decode deeplink by DeepLinkService
   * @param jobData
   *
   * @return {JobResult} return standard job response
   */
  public async decode(jobData: JobDecodeDeepLink): Promise<JobResult> {
    const hrStart = process.hrtime();
    try {
      const { coupon } = jobData;
      const link: any = await this.deepLinkService.getDecodedLink({ url: encodeURI(coupon.url) });
      if (link) {
        await this.couponService.findOneAndUpdate({
          _id: coupon._id,
        }, {
          $set: {
            originalUrl: link.data[0].attributes?.url,
          },
        });
        Logger.log(`Deep link is decoded for coupon ${coupon._id}`, 'DecodeDeepLinkService.decode');
        return {
          duration: process.hrtime(hrStart),
          message: 'Deep link is decoded',
          error: null,
        };
      }

      return {
        duration: process.hrtime(hrStart),
        error: 'Deep link is not decoded',
      };

    } catch (e) {
      Logger.error('Deep link decode error', e, 'DecodeDeepLinkService.decode');
      return {
        duration: process.hrtime(hrStart),
        error: e.message,
      };
    }
  }
}
