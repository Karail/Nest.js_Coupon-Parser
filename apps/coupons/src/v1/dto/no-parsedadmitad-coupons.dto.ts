import { NoParsedAdvcampaignDto as NoParsedAdvcampaign } from "./no-parsed-advcampaign.dto";
import { NoParsedCouponDto as NoParsedCoupon } from "./no-parsed-coupon.dto";

export interface NoParsedAdmitadCouponsDto {
    admitad_coupons: {
        advcampaign_categories: any[]
        advcampaigns: {
            advcampaign: NoParsedAdvcampaign[]
        }[]
        types: any[]
        categories: any[]
        species: any[]
        coupons: {
            coupon: NoParsedCoupon[]
        }[]
    }
}