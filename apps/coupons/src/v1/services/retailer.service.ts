import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Interfaces
import { RetailerDocumentInterface as Retailer } from '../interfaces';

@Injectable()
export class RetailerService {
    constructor(
      @InjectModel('Retailer') private readonly model: Model<Retailer>,
    ) {
    }

    /**
     * find and update retailer
     * @param conditions
     * @param update
     * @param optionalParams
     */
    public async findOneAndUpdate(conditions: {}, update: {}, optionalParams = {}): Promise<Retailer> {
        try {
            return this.model.findOneAndUpdate(conditions, update, optionalParams).lean();
        } catch (e) {
            Logger.error('Can not update retailer', e, 'RetailerService.findOneRetailerAndUpdate')
            throw Error(e)
        }
    }
}
