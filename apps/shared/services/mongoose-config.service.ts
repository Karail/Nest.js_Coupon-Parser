import { Injectable } from '@nestjs/common';
//Schemas
import {
  PlatformSchema,
  RetailerSchema,
  UserSchema,
  CouponSchema,
  DictionarySchema,
  MapRetailerToAdmitadFeedSchema,
  RetailerOnPlatformSchema,
} from 'apps/coupons/src/v1/schemas';
//Interfaces
import { MongooseSchemasConfig } from '../interfaces';

@Injectable()
export class MongooseConfigService {

  /**
   * Get models from map
   * @param {string[]} models array of models name
   *
   * @return {MongooseSchemasConfig[]} return imported objects
   */
  static getModels(models?: string[]): MongooseSchemasConfig[] {
    const modelsMap: MongooseSchemasConfig[] =  [
      { name: 'Coupon', schema: CouponSchema },
      { name: 'User', schema: UserSchema },
      { name: 'Platform', schema: PlatformSchema },
      { name: 'DictionaryCouponTag', schema: DictionarySchema },
      { name: 'DictionaryCouponType', schema: DictionarySchema },
      { name: 'DictionaryCouponSource', schema: DictionarySchema },
      { name: 'DictionaryRetailerType', schema: DictionarySchema },
      { name: 'DictionaryAffiliate', schema: DictionarySchema },
      { name: 'Retailer', schema: RetailerSchema },
      { name: 'MapRetailerToAdmitadFeed', schema: MapRetailerToAdmitadFeedSchema },
      { name: 'RetailerOnPlatform', schema: RetailerOnPlatformSchema },
    ];
    return models ? models.map(model => modelsMap.find(x => x.name === model)): modelsMap
  }
}