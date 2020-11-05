import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Interfaces
import { DictionaryDocumentInterface as Dictionary } from '../interfaces';

@Injectable()
export class DictionaryService {
    constructor(
        @InjectModel('DictionaryCouponTag') private readonly dictionaryCouponTagModel: Model<Dictionary>,
        @InjectModel('DictionaryCouponType') private readonly dictionaryCouponTypeModel: Model<Dictionary>,
        @InjectModel('DictionaryCouponSource') private readonly dictionaryCouponSourceModel: Model<Dictionary>,
        @InjectModel('DictionaryAffiliate') private readonly dictionaryAffiliateModel: Model<Dictionary>,
        @InjectModel('DictionaryRetailerType') private readonly dictionaryRetailerTypeModel: Model<Dictionary>,
    ) { }

    /**
     * find affiliate by conditions
     * @param conditions
     * @returns affiliate
     */
    public async findAffiliate(conditions: {}): Promise<Dictionary> {
        return this.dictionaryAffiliateModel.findOne(conditions).lean();
    }

    /**
     * find source by conditions
     * @param conditions
     * @returns source
     */
    public async findSource(conditions: {}): Promise<Dictionary> {
        return this.dictionaryCouponSourceModel.findOne(conditions).lean();
    }

    /**
     * find couponType by conditions
     * @param conditions
     * @returns couponType
     */
    public async findCouponType(conditions: {}): Promise<Dictionary> {
        return this.dictionaryCouponTypeModel.findOne(conditions).lean();
    }

    /**
     * find couponTags by conditions
     * @param conditions
     * @param orconditions
     * @returns couponTags
     */
    public async findCouponTags(conditions: {}, orconditions?: {}[]): Promise<Dictionary[]> {
        return this.dictionaryCouponTagModel
            .find(conditions)
            .or(orconditions)
            .lean();
    }

    /**
     * find retailerType by conditions
     * @param conditions
     * @returns retailerType
     */
    public async findRetailerType(conditions: {}): Promise<Dictionary> {
        return this.dictionaryRetailerTypeModel.findOne(conditions).lean();
    }
}
