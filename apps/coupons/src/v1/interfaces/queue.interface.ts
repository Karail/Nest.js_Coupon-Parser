//Dto
import { NoParsedAdvcampaignDto as NoParsedAdvcampaign } from "../dto/no-parsed-advcampaign.dto";
import { NoParsedCouponDto as NoParsedCoupon } from "../dto/no-parsed-coupon.dto";
// Interfaces

export interface JobCouponsParseInterface {
    options: {
        titleLang: string,
        platformId: any
    },
    coupon: NoParsedCoupon
    advcampaign: NoParsedAdvcampaign
}

export interface JobCouponsRequestInterface {
    platformSlug: string,
    titleLang: string,
    active: boolean
}
