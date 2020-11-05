import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Interfaces
import {
    CouponDocumentInterface as Coupon,
} from '../interfaces';

@Injectable()
export class CouponService {
    constructor(
        @InjectModel('Coupon') private readonly couponModel: Model<Coupon>
    ) { }

    /**
     * find coupon and update | create coupon
     * @param update
     * @param conditions
     * @returns coupon
     */
    public async findOneAndUpdate(conditions, update, optionalParams = {}): Promise<Coupon> {
        try {
            return this.couponModel.findOneAndUpdate(conditions, update, optionalParams).lean();
        } catch (e) {
            Logger.error('Can not update coupon', e, 'CouponService.findOneAndUpdate')
            throw Error(e)
        }
    }
}
