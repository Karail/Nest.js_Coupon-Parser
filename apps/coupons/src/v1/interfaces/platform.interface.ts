import { Document } from 'mongoose';

export interface PlatformItem {
    name: string;
    affiliateUrls: string[];
    slug: string;
}

export interface PlatformDocumentInterface extends PlatformItem, Document {

}
