export interface NoParsedCouponDto {
    $: { id: number },
    name: string[],
    advcampaign_id?: number[],
    rating?: number[],
    logo?: string[],
    description?: string[],
    specie_id?: number[],
    promocode?: string[],
    promolink?: string[],
    gotolink?: string[],
    date_start?: string[],
    date_end?: string[],
    exclusive?: string[],
    discount?: string[],
    types?: {
        type_id: number[]
    }[],
    categories?: {
        category_id: number[]
    }[],
    special_category?: string[]
}