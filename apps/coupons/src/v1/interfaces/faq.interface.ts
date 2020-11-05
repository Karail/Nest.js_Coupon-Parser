import {Int32, ObjectID} from 'bson';
// Interfaces
import { PlatformDocumentInterface } from "./platform.interface";
import { UserDocumentInterface as Ys } from './user.interface';

export interface FAQItem {
    _id: ObjectID;
    platformId: PlatformDocumentInterface['_id'];
    question: string;
    answer: string;
    active: boolean;
    createdAt: Date;
    updatedAt: Date;
    updatedBy: Ys['_id'];
    createdBy: Ys['_id'];
    _v?: Int32;
}
