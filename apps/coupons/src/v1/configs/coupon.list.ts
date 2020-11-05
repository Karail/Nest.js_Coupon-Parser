import { CouponMatchInterface } from "../interfaces"

/**
 * match coupon by regex
 * @param text
 */
export const couponMatch = (text: string): CouponMatchInterface => {
    return {
        percents: text.match(/\d+(?=%)/g),
        everything: text.match(/навс([её])/gi),
        freeShipping: text.match(/бесплатнаядоставка/gi),
        discountRubles: text.match(/(?<=([cс])кидк.)\d+(?=р|руб\.|p\.|рублей|₽)/gi),
        rubles: text.match(/\d+(?=р|руб\.|p\.|рублей|₽)/gi),
        dollars: text.match(/((?<=\$)(\d+[,.]?)+)|((\d+[,.]?)+(?=\$|долларов))/g),
        cashback: text.match(/cashback|кэшбэк/gi),
        bonuses: text.match(/бонус/gi),
        stock: text.match(/акция/gi),
        numStok: text.match(/(\d+(?==)|(?<==)\d+)|(\d+(?=товарапоцене)|(?<=товарапоцене)\d+)|(\d+\+\d+(?==))/gi),
        free: text.match(/бесплат/gi),
        gift: text.match(/подарок/gi),
        freeGift: text.match(/бесплатныйподарок/gi),
        forAmount: text.match(/(?<=от)\d+/gi),
        discount: text.match(/([cс])кидк./gi)
    }
}
