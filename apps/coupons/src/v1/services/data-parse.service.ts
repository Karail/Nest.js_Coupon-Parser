import { Injectable, Logger } from '@nestjs/common';
import { InjectEventEmitter } from 'nest-emitter';
import { Types } from 'mongoose';
// Services
import { DictionaryService } from './dictionary.service';
import { ContentManagerService } from './content-manager.service';
import { MapRetailerToAdmitadFeedService} from './map-retailer-admitad-feed.service';
import { RetailerOnPlatformService } from './retailer-on-platform.service';
// Events
import { AppEventsEmitter } from '../app.events';
// Dto
import { NoParsedAdvcampaignDto as NoParsedAdvcampaign } from '../dto';
// Interfaces
import {
  CouponDocumentInterface,
  CouponMatchInterface,
  DictionaryDocumentInterface as Dictionary,
} from '../interfaces';
// Configs
import { couponMatch } from '../configs/coupon.list';
//Utils
import { getCouponFileds, getCouponTypes } from '../utils';

@Injectable()
export class DataParseService {
  constructor(
    private readonly dictionaryService: DictionaryService,
    private readonly mapRetailerToAdmitadFeedService: MapRetailerToAdmitadFeedService,
    private readonly retailerOnPlatformService: RetailerOnPlatformService,
    private readonly contentManagerService: ContentManagerService,
    @InjectEventEmitter() private readonly emitter: AppEventsEmitter,
  ) {
  }

  /**
   * parse dateEnd
   * @param dateEnd
   * @returns dateEnd
   */
  public parseDateEnd(dateEnd: string): Date {
    let date = new Date();
    date.setFullYear(date.getFullYear() + 1);
    if (dateEnd != 'None') {
      date = new Date(dateEnd);
    }
    return date;
  }

  /**
   * parse: retailerId, retailerOnPlatformId, retailerTypeId, isModerated
   * @param advcampaign
   * @param platformId
   * @param dictionary
   * @param userId
   * @returns obj { retailerId, retailerOnPlatformId, retailerTypeId, isModerated }
   */
  public async parseRetailer(
    advcampaign: NoParsedAdvcampaign,
    platformId: any,
    dictionary: {
      affiliate: Dictionary,
      retailerType: Dictionary
    },
    userId: any,
  ): Promise<Pick<CouponDocumentInterface, 'retailerId' | 'retailerOnPlatformId' | 'retailerTypeId' | 'isModerated'>> {
    try {
      const retailerToAdmitad = await this.mapRetailerToAdmitadFeedService.findOne({
        feedRetailerId: advcampaign.$.id.toString(),
      });
      let isModerated = true;
      let retailerId = retailerToAdmitad?.retailerId;

      if (!retailerToAdmitad) {
        // Emit `notRetailer` event
        this.emitter.emit('notRetailer', advcampaign.$.id);

        const { retailerToAdmitad } = await this.contentManagerService.create(
          advcampaign,
          platformId,
          dictionary,
          userId,
        );

        retailerId = retailerToAdmitad.retailerId;
        isModerated = false;
      }

      const { _id: retailerOnPlatformId, typeId } = await this.retailerOnPlatformService.findOne({
        retailerId,
        platformId,
      });

      return {
        retailerId,
        retailerOnPlatformId,
        retailerTypeId: typeId,
        isModerated,
      };
    } catch (e) {
      Logger.error('Parse retailer error', e, 'DataParseService.parseRetailer');
      throw Error(e);
    }
  }

  /**
   * parse tagListId
   * @param exclusive
   * @returns tagListId
   */
  public async parseTagListId(exclusive: string): Promise<Types.ObjectId[] | []> {
    try {
      if (exclusive) {
        const couponTags = await this.dictionaryService.findCouponTags(null, [
          { name: exclusive },
          { slug: exclusive },
        ]);
        return couponTags.map((tag) => Types.ObjectId(tag._id));
      }

      return [];
    } catch (e) {
      Logger.error('Parse TagListId error', e, 'DataParseService.parseTagListId');
      throw Error(e);
    }
  }

  /**
   * parse typeId
   * @param promocode
   * @returns typeId
   */
  public async parseTypeId(promocode: string): Promise<Types.ObjectId> {
    try {
      const type = await this.dictionaryService.findCouponType({
        name: promocode === 'Не нужен' ? 'Скидка' : 'Промокод',
      });

      return type._id;
    } catch (e) {
      Logger.error('Parse typeId error', e, 'DataParseService.parseTypeId');
      throw e;
    }
  }

  /**
   * parse iconType
   * @param extraTextField
   * @param textField
   * @returns iconType
   */
  public parseIconType(extraTextField: string, textField: string): string {
    const iconTypeTypes = {
      best: textField === 'Лучшая' && extraTextField === 'цена',
      special: textField === 'Лучшее' && extraTextField === 'предложение',
      gift: textField === 'Беспл' && extraTextField === 'подарок',
      delivery: textField === 'Беспл' && extraTextField === 'доставка',
      sale: extraTextField === 'на ВСЁ',
    };
    const iconTypeName = Object.keys(iconTypeTypes).find(key => iconTypeTypes[key]);

    return iconTypeName || '';
  }

  /**
   * Get extra fields depends on coupon's name
   * @returns extra fields
   * @param couponText
   */
  public regexpText(couponText: string): Pick<CouponDocumentInterface, 'textField' | 'extraTextField'> {
    const matchedObjCoupons = couponMatch(couponText.replace(/\s/g, '').replace(/,/g, '.'));
    const couponName = this.detectCouponName(matchedObjCoupons);

    return getCouponFileds(couponName, matchedObjCoupons);
  }

  /**
   * Find coupon name
   * @param matchedObjCoupons
   * @returns coupon type name
   */
  public detectCouponName(matchedObjCoupons: CouponMatchInterface): string | undefined {
    const couponTypes = getCouponTypes(matchedObjCoupons);

    return Object.keys(couponTypes).find(key => couponTypes[key]);
  }
}
