import { Document } from 'mongoose';
// Interface
import { UserDocumentInterface as Ys } from './user.interface';
import { IAffiliate, ICategory, IRetailerOptions, IRetailerType } from './dictionary.interface';
import { CloudinaryImage } from './cloudinary.interface';
import { PlatformDocumentInterface } from './platform.interface';

export interface RetailerItem {
    name: string;
    alternativeName: string;
    image: CloudinaryImage;
    slug: string;
    active: boolean;
    affiliateId?: IAffiliate['_id'];
    categoryListId: ICategory['_id'][];
    createdAt: Date;
    updatedAt: Date;
    updatedBy: Ys['_id'];
    createdBy: Ys['_id'];
}

export interface RetailerOnPlatformItem {
    slug: string;
    retailerId: RetailerDocumentInterface['_id'];
    platformId: PlatformDocumentInterface['_id'];
    sliderImage?: CloudinaryImage;
    bannerImage?: CloudinaryImage;
    similarRetailerOnPlatformListId?: RetailerOnPlatformDocumentInterface['_id'][];
    popularRetailerOnPlatformListId?: RetailerOnPlatformDocumentInterface['_id'][];
    optionListId?: IRetailerOptions['_id'][];
    sort?: number;
    typeId?: IRetailerType['_id'];
    imageText?: string;
    metaTitle?: string;
    metaDescription?: string;
    metaKeywords?: string;
    mainTitle?: string;
    subTitle?: string;
    url?: string;
    sidebarName?: string;
    sidebarText?: string;
    isIndexingBySearchRobots?: boolean;
    contacts?: {
        legalAddress: string,
        email: string,
        phone: string,
        socials: {
            vk: string,
            facebook: string,
            youtube: string,
            instagram: string
        }
    },
    createdAt: Date;
    updatedAt: Date;
    updatedBy: Ys['_id'];
    createdBy: Ys['_id'];
    rating?: {
        score: number;
        numberOfVotes: number;
    }
    active: boolean;
}

export interface MapRetailerToAdmitadFeedItem {
    retailerName: string;
    feedRetailerId: string;
    retailerId: RetailerDocumentInterface['_id'];
    createdAt: Date;
    updatedAt: Date;
    updatedBy: Ys['_id'];
    createdBy: Ys['_id'];
}

export interface RetailerDocumentInterface extends RetailerItem, Document {
}

export interface RetailerOnPlatformDocumentInterface extends RetailerOnPlatformItem, Document {
}

export interface MapRetailerToAdmitadFeedDocumentInterface extends MapRetailerToAdmitadFeedItem, Document {
}
