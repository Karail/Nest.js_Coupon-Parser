import {  Logger, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EventEmitter } from 'events';
import { NestEmitterModule } from 'nest-emitter';
// Services
import { AppService } from './app.service';
import {
  CloudinaryService,
  CouponParseService,
  DataParseService,
  DictionaryService,
  MailService,
  PlatformService,
  RetailerService,
  MapRetailerToAdmitadFeedService,
  RetailerOnPlatformService,
  UserService,
  CouponService,
  ContentManagerService,
} from './services';
import { CouponsRequestService } from './services/coupon-request.service';
import { MongooseConfigService } from 'apps/shared/services/mongoose-config.service';
// Consumers
import { CouponsConsumer } from './consumers/coupons.consumer';
// Modules
import { bullQueueModule } from '../../../shared/dynamic-modules/bull.module';

@Module({
  imports: [
    NestEmitterModule.forRoot(new EventEmitter()),
    MongooseModule.forRoot( process.env.DB_URI,
      {
        connectionName: 'coupons',
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        useFindAndModify: false,
        poolSize: 15,
        autoIndex: true,
        connectionFactory: (connection) => {
          connection.on('error', (err) => {
            Logger.error('Mongoose connection error', err, 'MongooseModule.init')
            process.exit(1)
          })
          return connection;
        }
    }),
    MongooseModule.forFeature(MongooseConfigService.getModels(), 'coupons'),
    bullQueueModule(`${process.env.REDIS_PREFIX}-coupons`),
    bullQueueModule(`${process.env.REDIS_PREFIX}-decode-deep-link`),
  ],
  providers: [
    AppService,
    CouponService,
    PlatformService,
    CouponParseService,
    CouponsRequestService,
    RetailerService,
    MapRetailerToAdmitadFeedService,
    RetailerOnPlatformService,
    DictionaryService,
    UserService,
    DataParseService,
    CloudinaryService,
    ContentManagerService,
    MailService,
    // Consumers
    CouponsConsumer,
  ],
})

export class AppModule {

}
