import { Document } from 'mongoose';

export interface Ys {
    password: string,
    email: string,
    isAdmin: boolean,
    name: {
        last: string;
        first: string;
    }
}

export interface UserDocumentInterface extends Ys, Document {

}