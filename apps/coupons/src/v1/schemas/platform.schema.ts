import { Schema, Types } from 'mongoose';

export const PlatformSchema = new Schema({
    name: String,
    affiliateUrls: [String],
    slug: String,
    options: {
        mainPage: {
            sliderRetailerListCount: Number,
            // bannerRetailerListCount: number;
            carouselRetailerListCount: Number,
            bestCouponListCount: Number,
            // couponByCategoryCategoryListId: DictionaryCategoryItem['_id'][];
            couponByCategoryColumnCouponCount: Number,
            couponByCategoryGroupCount: Number,
            bestRetailerListCount: Number,
            bestRetailerListCountWeek: Number,
            recommendedCouponListCount: Number,
            popularRetailerListCount: Number,
        },
        retailerPage: {
            promoBlockCount: Number,
            sidebarBlockCount: Number,
            similarCouponListCount: Number,
            // faqBlock: FAQItem;
        },
        retailerSearchLimit: Number,
    },
    createdAt: Date,
    updatedAt: Date,
    updatedBy: { type: Types.ObjectId, ref: 'User', index: true },
    createdBy: { type: Types.ObjectId, ref: 'User', index: true },
}, {
    _id: false,
    collection: 'platforms'
});