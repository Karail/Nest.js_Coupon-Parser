import { Schema } from 'mongoose';

export const DictionarySchema = new Schema({
  name: String,
  slug: String,
  createdAt: Date,
  updatedAt: Date
})
