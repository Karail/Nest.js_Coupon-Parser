import { Types, Schema } from 'mongoose';

export const RetailerSchema = new Schema ({
  name: String,
  alternativeName: String,
  slug: String,
  image: {},
  affiliateId: { type: Types.ObjectId, ref: 'DictionaryAffiliate' },
  active: Boolean,
  createdAt: Date,
  updatedAt: Date,
  updatedBy: { type: Types.ObjectId, ref: 'User' },
  createdBy: { type: Types.ObjectId, ref: 'User' },
})
