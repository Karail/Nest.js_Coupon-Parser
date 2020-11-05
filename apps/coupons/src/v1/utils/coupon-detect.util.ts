import { CouponMatchInterface } from "apps/coupons/src/v1/interfaces"

/**
* Get coupon types
* @returns coupon types
* @param couponMatchObj
*/
export const getCouponTypes = (couponMatchObj: CouponMatchInterface) => {
    const {
        percents, everything, freeShipping, discountRubles, rubles, dollars,
        cashback, bonuses, stock, numStok, free, gift, freeGift, forAmount, discount
    } = couponMatchObj
    return {
        'discount': !!discount && !rubles && !percents && !dollars,
        'stock': (!!stock || !!numStok) && numStok?.length == 2,
        'freeShipping': !!freeShipping,
        'freeGiftForAmount': !!gift && !!forAmount,
        'freeGiftForRublesOrPercents': !!gift && (!!rubles || !!percents) && rubles?.length == 1,
        'freeGift': (!!freeGift || !!gift || !!free) && (!rubles && !dollars),
        'percents': percents?.length == 2,
        'bonuses': !!bonuses && !!rubles,
        'cashbackRubles': !!cashback && !!rubles,
        'cashbackPercents': !!cashback && !!percents,
        'dollars': dollars?.length == 1,
        'everything': !!everything && percents?.length == 1,
        'onePercent': percents?.length == 1 && !discountRubles,
        'rubles': !!rubles && rubles?.length == 1,
        'discountRubles': !!discountRubles,
    }
}

/**
 * Return extra fields
 * @param textField
 * @param extraTextField
 * @returns extra fields
 */
const getExtraField = (textField: string, extraTextField: string) => {
    return {
        textField,
        extraTextField,
    }
}

/**
 * Get coupon fileds for DB
 * @param couponName
 * @param couponObj
 * @returns extra fields
 */
export const getCouponFileds = (couponName: string, couponObj: CouponMatchInterface) => {
    const { numStok, rubles, percents, dollars, discountRubles } = couponObj;
    switch (couponName) {
        case 'discount': //'скидка без цены'
            return getExtraField('Лучшая', 'цена');
        case 'stock': //'акция 3=2 | 4 товара по цене 2'
            return getExtraField(`${numStok[0]}=${numStok[1]}`, 'купон');
        case 'freeShipping': //'бесплатная доставка'
            return getExtraField(`Беспл`, 'доставка');
        case 'freeGiftForAmount': //'бесплатный подарк за сумму покупи
            return getExtraField(`Беспл`, 'подарок');
        case 'freeGiftForRublesOrPercents': //'сумма или число скидки + какой-то подарок
            return getExtraField(`${rubles[0]}Р`, 'купон');
        case 'freeGift': //'бесплатный подарок без суммы
            return getExtraField(`Беспл`, 'подарок');
        case 'percents': //'30% -5%'
            return getExtraField(`${Math.max(...percents.map(Number))}%`, 'купон');
        case 'bonuses': //'До 20 000 бонусов за покупку тренажера!'
            return getExtraField('Лучшее', 'предложение');
        case 'cashbackRubles': //'cashback 500Р '
            return getExtraField(`${rubles[0]}Р`, 'кэшбэк');
        case 'cashbackPercents': // 'cashback %'
            return getExtraField(`${percents[0]}%`, 'кэшбэк');
        case 'dollars': //'$3'
            return getExtraField(`${dollars[0]}$`, 'купон');
        case 'everything': //'50% на всё'
            return getExtraField(`${percents[0]}%`, 'на ВСЁ');
        case 'onePercent': //'50%'
            return getExtraField(`${percents[0]}%`, 'купон');
        case 'rubles': //'500Р'
            return getExtraField(`${rubles[0]}Р`, 'купон');
        case 'discountRubles':
            return getExtraField(`${discountRubles[0]}Р`, 'купон');
        default:
            return getExtraField('Лучшее', 'предложение');
    }
}
