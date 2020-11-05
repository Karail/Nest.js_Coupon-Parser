import { Document } from 'mongoose';

export interface DictionaryItem {
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface DictionaryDocumentInterface extends DictionaryItem, Document {
}

export type IAffiliate = DictionaryDocumentInterface
export type ICouponType = DictionaryDocumentInterface
export type ICouponSource = DictionaryDocumentInterface
export type ICouponTags = DictionaryDocumentInterface
export type IRetailerType = DictionaryDocumentInterface
export type ICategory = DictionaryDocumentInterface
export type IRetailerOptions = DictionaryDocumentInterface
