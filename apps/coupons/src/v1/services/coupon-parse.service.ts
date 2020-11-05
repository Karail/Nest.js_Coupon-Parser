import { Injectable, Logger } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
// libs
import * as franc from 'franc';
import * as slugify from '@sindresorhus/slugify';
//Services
import { DictionaryService } from './dictionary.service';
import { UserService } from './user.service';
import { CouponService } from './coupon.service';
import { DataParseService } from './data-parse.service';
import { RetailerService } from './retailer.service';
import { CloudinaryService } from './cloudinary.service';
// Interfaces
import { JobCouponsParseInterface as JobCouponsParse } from '../interfaces';
import { JobResult } from '../../../../shared/interfaces';
// Emitters
import { AppEventsEmitter } from '../app.events';

@Injectable()
export class CouponParseService {
    constructor(
      private readonly couponService: CouponService,
      private readonly retailerService: RetailerService,
      private readonly userService: UserService,
      private readonly cloudinaryService: CloudinaryService,
      private readonly dictionaryService: DictionaryService,
      private readonly dataParseService: DataParseService,
      @InjectEventEmitter() private readonly emitter: AppEventsEmitter,
    ) {
    }

    /**
     * Parse coupon job, (add | update) coupon to db
     * @param jobData
     *
     * @return {JobResult} return standard job response
     */
    public async parse(jobData: JobCouponsParse): Promise<JobResult> {
        const hrStart = process.hrtime();
        try {
            const {
                coupon: {
                    $: { id: couponId },
                    logo,
                    name,
                    gotolink,
                    promocode,
                    exclusive,
                    description,
                    date_start: dateStart,
                    date_end: dateEnd,
                }, options, advcampaign
            } = jobData;

            const lang = franc
              .all(name[0])
              .find((item) => item[0] === options.titleLang);

            if (lang && lang[1] > 0.6) {
                const user = await this.userService.findOneUser();
                const affiliate = await this.dictionaryService.findAffiliate({ slug: 'admitad' });
                const retailerType = await this.dictionaryService.findRetailerType({ slug: 'a-1' });
                const source = await this.dictionaryService.findSource({ slug: 'affiliate-network' });
                const {
                    retailerId,
                    retailerOnPlatformId,
                    retailerTypeId,
                    isModerated,
                } = await this.dataParseService.parseRetailer(advcampaign, options.platformId, { affiliate, retailerType }, user._id);

                const { extraTextField, textField } = this.dataParseService.regexpText(name[0]);

                const parsedCoupon = await this.couponService.findOneAndUpdate({
                    feedId: couponId
                }, {
                    $set: {
                        feedId: couponId,
                        url: gotolink && gotolink ? gotolink[0] : '',
                        dateStart: new Date(dateStart[0]),
                        platformId: options.platformId,
                        slug: slugify(name[0]),
                        active: true,
                        isBanner: false,
                        updatedBy: user._id,
                        affiliateId: affiliate._id,
                        sourceId: source._id,
                        updatedAt: new Date(),
                        iconType: this.dataParseService.parseIconType(extraTextField, textField),
                        typeId: promocode && await this.dataParseService.parseTypeId(promocode[0]),
                        tagListId: exclusive && await this.dataParseService.parseTagListId(exclusive[0]),
                        retailerId,
                        retailerOnPlatformId,
                        retailerTypeId,
                        isModerated,
                        dateEnd: dateEnd && this.dataParseService.parseDateEnd(dateEnd[0]),
                        sort: 0,
                        isUrlModified: false
                    },
                    // only create
                    $setOnInsert: {
                        title: name[0],
                        description: description && description[0] ? description[0] : '',
                        code: promocode && promocode[0] === 'Не нужен' ? '' : promocode[0],
                        textField,
                        extraTextField,
                        createdAt: new Date(),
                        createdBy: user._id,
                    }
                }, {
                    upsert: true,
                    new: true
                });

                // Update retailer's image to cloudinary
                if (logo.length) {
                    await this.retailerService.findOneAndUpdate({
                        _id: retailerId,
                        $or: [ {'image.secure_url': ''}, { 'image.secure_url': { $exists: false }} ]
                        }, {
                        image: await this.cloudinaryService.getCloudinaryUrl(logo[0])
                    })
                }

                // Decode coupon's url
                if (parsedCoupon.isUrlModified && parsedCoupon.url || parsedCoupon.url && !parsedCoupon.originalUrl) {
                    Logger.log('Need decode deep link', 'CouponParseService.parse')
                    await this.emitter.emit('decodeDeeplink', {
                        coupon: parsedCoupon,
                    });
                }
            }
            return {
                duration: process.hrtime(hrStart),
                message: 'Coupon saved to db',
                error: null
            }
        } catch (e) {
            Logger.error('Coupons parse error', e, 'CouponParseService.parse');
            return {
                duration: process.hrtime(hrStart),
                error: e.message
            }
        }
    }
}
