import * as mongoose from 'mongoose';
import { Types } from 'mongoose';

export const CouponSchema = new mongoose.Schema({
    feedId: Number,
    retailerOnPlatformId: { type: Types.ObjectId, ref: 'RetailerOnPlatform', index: true },
    retailerId: { type: Types.ObjectId, ref: 'Retailer', index: true },
    platformId: { type: Types.ObjectId, ref: 'Platform', index: true },
    tagListId: [ { type: Types.ObjectId, ref: 'DictionaryCouponTag', index: true } ],
    title: String,
    description: String,
    url: String,
    originalUrl: String,
    sort: Number,
    code: String,
    slug: String,
    dateStart: Date,
    dateEnd: Date,
    textField: String,
    extraTextField: String,
    active: Boolean,
    iconType: String,
    typeId: { type: Types.ObjectId, ref: 'DictionaryCouponType', index: true },
    sourceId: { type: Types.ObjectId, ref: 'DictionaryCouponSource', index: true },
    retailerTypeId: { type: Types.ObjectId, ref: 'DictionaryRetailerType', index: true },
    affiliateId: { type: Types.ObjectId, ref: 'DictionaryAffiliate', index: true },
    // categoryListId: DictionaryCategoryItem['_id'][];
    isModerated: Boolean,
    createdAt: Date,
    updatedAt: Date,
    updatedBy: { type: Types.ObjectId, ref: 'User', index: true },
    createdBy: { type: Types.ObjectId, ref: 'User', index: true },
    isBanner: Boolean,
    isUrlModified: {
       type: Boolean,
       default: false
    },
});

/**
 * Detect changes in parsed url
 */
CouponSchema.pre('findOneAndUpdate', async function(next) {
    const docToUpdate = await this.findOne(this.getQuery());
    await this.update(this.getQuery(), { isUrlModified: this.getUpdate().$set.url !== docToUpdate?.url })
    next()
});

