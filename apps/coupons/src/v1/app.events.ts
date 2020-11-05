import { EventEmitter } from 'events';
import { StrictEventEmitter } from 'nest-emitter';
//Interfaces
import { CouponDocumentInterface as Coupon } from './interfaces';

export interface AppEvents {
    notRetailer: number;
    decodeDeeplink: { coupon: Coupon }
}
export type AppEventsEmitter = StrictEventEmitter<EventEmitter, AppEvents>;
