import { Types, Schema } from 'mongoose';

export const RetailerOnPlatformSchema = new Schema ({
  slug: String,
  retailerId: { type: Types.ObjectId, ref: 'Retailer', index: true },
  platformId: { type: Types.ObjectId, ref: 'Platform', index: true },
  typeId: { type: Types.ObjectId, ref: 'DictionaryRetailerType', index: true },
  active: Boolean,
  isIndexingBySearchRobots: Boolean,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: { type: Types.ObjectId, ref: 'User' },
  createdBy: { type: Types.ObjectId, ref: 'User' },
})
