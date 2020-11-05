import { Schema, Types } from 'mongoose';

export const UserSchema = new Schema({
    password: String,
    email: String,
    isAdmin: Boolean,
    name: {
        last: String,
        first: String,
    }
}, {
    _id: false,
    collection: 'ys'
});