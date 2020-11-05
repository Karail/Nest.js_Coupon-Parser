import { Schema } from 'mongoose';

export interface MongooseSchemasConfig {
    name: string,
    schema: Schema
}