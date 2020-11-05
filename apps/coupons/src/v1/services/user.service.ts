import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Interfaces
import {
    UserDocumentInterface as User,
} from '../interfaces';

@Injectable()
export class UserService {
    constructor(
        @InjectModel('User') private readonly userModel: Model<User>,
    ) { }

    /**
     * find user
     * @returns user
     */
    public async findOneUser(): Promise<User> {
        try {
            return this.userModel.findOne({
                email: process.env.COUPONS_DEFAULT_SYSTEM_USER_EMAIL
            }).lean();
        } catch (e) {
            Logger.error('Can not find user', e, 'UserService.findOneUser');
            throw e;
        }
    }
}
