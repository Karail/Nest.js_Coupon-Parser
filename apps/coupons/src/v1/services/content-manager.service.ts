import { Injectable, Logger } from '@nestjs/common';
import * as slugify from '@sindresorhus/slugify';
//Dto
import { NoParsedAdvcampaignDto as NoParsedAdvcampaign } from '../dto';
// Interfaces
import {
  DictionaryDocumentInterface as Dictionary,
  MapRetailerToAdmitadFeedDocumentInterface as MapRetailerToAdmitadFeed,
  RetailerOnPlatformDocumentInterface as RetailerOnPlatform,
  RetailerDocumentInterface as Retailer,
} from '../interfaces';
// Services
import { RetailerService } from './retailer.service';
import { MapRetailerToAdmitadFeedService } from './map-retailer-admitad-feed.service';
import { RetailerOnPlatformService } from './retailer-on-platform.service';

@Injectable()
export class ContentManagerService {
  constructor(
    private readonly retailerService: RetailerService,
    private readonly mapRetailerToAdmitadFeedService: MapRetailerToAdmitadFeedService,
    private readonly retailerOnPlatformService: RetailerOnPlatformService,
  ) { }

  /**
   * Create new retailer
   * @param advcampaign
   * @param platformId
   * @param dictionary
   * @param userId
   */
  public async create( advcampaign: NoParsedAdvcampaign, platformId: any, dictionary: {
      affiliate: Dictionary,
      retailerType: Dictionary
    },
    userId: any
  ): Promise<{ retailer: Retailer; retailerToAdmitad: MapRetailerToAdmitadFeed; retailerOnPlatform: RetailerOnPlatform; }> {
    try {
      const retailer = await this.retailerService.findOneAndUpdate({
          name: advcampaign.name[0],
      },
  {
          $set: {
            name: advcampaign.name[0],
            slug: slugify(advcampaign.name[0]),
            affiliateId: dictionary.affiliate._id,
            categoryListId: [],
            image: null,
            updatedBy: userId,
            createdBy: userId,
            createdAt: new Date(),
            updatedAt: new Date(),
            active: true,
            alternativeName: advcampaign.name[0]
          }
        },
        {
          upsert: true,
          new: true
        }
      )

      // Add retailer to map
      const retailerToAdmitad = await this.mapRetailerToAdmitadFeedService.findOneAndUpdate({
        feedRetailerId: advcampaign.$.id.toString()
      }, {
        $set: {
          retailerName: advcampaign.name[0],
          retailerId: retailer._id,
          updatedBy: userId,
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date()
        },
      },
        {
          upsert: true,
          new: true
        }
      );

      // Add retailer to platform
      const retailerOnPlatform = await this.retailerOnPlatformService.findOneAndUpdate({
        retailerId: retailer._id,
        platformId: platformId
      }, {
        $set: {
          slug: `promokod-${slugify(advcampaign.name[0])}`,
          url: advcampaign.site[0],
          typeId: dictionary.retailerType._id,
          updatedBy: userId,
          createdBy: userId,
          createdAt: new Date(),
          updatedAt: new Date(),
          active: true,
        },
      },
      {
        upsert: true,
          new: true
      });

      return {
        retailer,
        retailerToAdmitad,
        retailerOnPlatform
      }
    } catch (e) {
      Logger.error('Create  new retailer error', e, 'RetailerService.create');
      throw Error(e);
    }
  }
}
