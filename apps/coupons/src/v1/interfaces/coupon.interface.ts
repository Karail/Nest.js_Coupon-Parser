import { Document } from 'mongoose';
// Interfaces
import { UserDocumentInterface as Ys } from './user.interface';
import { CloudinaryImage } from './cloudinary.interface';
import { IAffiliate, ICategory, ICouponSource, ICouponTags, ICouponType } from './dictionary.interface';
import { PlatformDocumentInterface } from './platform.interface';
import { RetailerDocumentInterface, RetailerOnPlatformDocumentInterface } from './retailer.interface';

export interface CouponItem {
    feedId: number;
    retailerOnPlatformId: RetailerOnPlatformDocumentInterface['_id'];
    retailerId: RetailerDocumentInterface['_id'];
    platformId: PlatformDocumentInterface['_id'];
    tagListId: ICouponTags['_id'][];
    title: string;
    description: string;
    url: string;
    originalUrl: string;
    sort: number;
    code: string;
    slug: string;
    dateStart: Date;
    dateEnd: Date;
    textField: string;
    extraTextField: string;
    active: boolean;
    iconType?: string;
    typeId: ICouponType['_id'];
    sourceId: ICouponSource['_id'];
    retailerTypeId: RetailerOnPlatformDocumentInterface['typeId'];
    affiliateId?: IAffiliate['_id'];
    categoryListId: ICategory['_id'][];
    isModerated: boolean;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: Ys['_id'];
    createdBy: Ys['_id'];
    isBanner?: boolean;
    image?: CloudinaryImage;
    isUrlModified: boolean;
}

export interface CouponDocumentInterface extends CouponItem, Document {

}
