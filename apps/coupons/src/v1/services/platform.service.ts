import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// Interfaces
import {
    PlatformDocumentInterface as Platform,
} from '../interfaces';

@Injectable()
export class PlatformService {
    constructor(
        @InjectModel('Platform') private readonly platformModel: Model<Platform>,
    ) { }

    /**
     * find platform by conditions
     * @param conditions
     * @returns platform
     */
    public async findOne(conditions: any): Promise<Platform> {
        try {
            return this.platformModel.findOne(conditions).lean();
        } catch (e) {
            Logger.error('Can not find platform', e, 'PlatformService.findOne');
            throw e;
        }
    }
}
