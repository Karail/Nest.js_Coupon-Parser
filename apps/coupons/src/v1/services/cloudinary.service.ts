import * as cloudinary from 'cloudinary';
import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class CloudinaryService {
  constructor() {
    cloudinary.v2.config({
      // eslint-disable-next-line @typescript-eslint/camelcase
      cloud_name: process.env.CLOUDINARY_NAME,
      // eslint-disable-next-line @typescript-eslint/camelcase
      api_key: process.env.CLOUDINARY_KEY,
      // eslint-disable-next-line @typescript-eslint/camelcase
      api_secret: process.env.CLOUDINARY_SECRET,
    });
  }

  /**
   * Get cloudinary url
   * @param logo
   * @returns upload qpi response
   */
  public async getCloudinaryUrl(logo: string): Promise<cloudinary.UploadApiResponse> {
    try {
      return await cloudinary.v2.uploader.upload(logo);
    } catch (e) {
      Logger.error('cloudinary error', e, 'CloudinaryService.getCloudinaryUrl');
      throw Error(e);
    }
  }
}

