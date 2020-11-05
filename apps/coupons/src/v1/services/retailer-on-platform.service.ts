import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Interfaces
import { RetailerOnPlatformDocumentInterface as RetailerOnPlatform } from '../interfaces';

@Injectable()
export class RetailerOnPlatformService {
  constructor(
    @InjectModel('RetailerOnPlatform') private readonly model: Model<RetailerOnPlatform>,
  ) {}

  /**
   * Find one and update
   * @param update
   * @param conditions
   * @param optionalParams
   */
  public async findOneAndUpdate(conditions, update, optionalParams = {}): Promise<RetailerOnPlatform> {
    try {
      return this.model.findOneAndUpdate(conditions, update, optionalParams).lean();
    } catch (e) {
      Logger.error('Can not update retailerOnPlatform', e, 'RetailerOnPlatformService.findOneAndUpdate')
      throw Error(e)
    }
  }

  /**
   * Find one
   * @param conditions
   */
  public async findOne(conditions: {}): Promise<RetailerOnPlatform> {
    try {
      return this.model.findOne(conditions).lean();
    } catch (e) {
      Logger.error('Can not find retailerOnPlatform', e, 'RetailerOnPlatformService.findOne')
      throw Error(e)
    }
  }
}
