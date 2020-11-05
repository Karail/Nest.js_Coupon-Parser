import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Interfaces
import { MapRetailerToAdmitadFeedDocumentInterface as MapRetailerToAdmitadFeed } from '../interfaces';

@Injectable()
export class MapRetailerToAdmitadFeedService {
  constructor(
    @InjectModel('MapRetailerToAdmitadFeed') private readonly model: Model<MapRetailerToAdmitadFeed>
  ) {
  }

  /**
   * Find one and update
   * @param update
   * @param conditions
   * @param optionalParams
   */
  public async findOneAndUpdate(conditions, update, optionalParams = {}): Promise<MapRetailerToAdmitadFeed> {
    try {
      return this.model.findOneAndUpdate(conditions, update, optionalParams).lean();
    } catch (e) {
      Logger.error('Can not update mapRetailerToAdmitadFeed', e, 'MapRetailerToAdmitadFeedService.findOneAndUpdate')
      throw Error(e)
    }
  }


  /**
   * Find one
   * @param conditions
   */
  public async findOne(conditions: {}): Promise<MapRetailerToAdmitadFeed> {
    try {
      return this.model.findOne(conditions).lean();
    } catch (e) {
      Logger.error('Can not find mapRetailerToAdmitadFeed', e, 'MapRetailerToAdmitadFeedService.findOne')
      throw Error(e)
    }
  }
}
