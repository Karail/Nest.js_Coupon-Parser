import { Types, Schema } from 'mongoose';

export const MapRetailerToAdmitadFeedSchema = new Schema ({
  retailerName: String,
  feedRetailerId: String,
  retailerId: { type: Types.ObjectId, ref: 'Retailer' },
  createdAt: Date,
  updatedAt: Date,
  updatedBy: { type: Types.ObjectId, ref: 'User' },
  createdBy: { type: Types.ObjectId, ref: 'User' },
})
