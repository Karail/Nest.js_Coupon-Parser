import { Logger, Module } from '@nestjs/common';
import { DeepLinkModule } from 'deeplink-module';
import { MongooseModule } from '@nestjs/mongoose';
// Services
import { DecodeDeepLinkService } from './services/decode-deep-link.service'
import { CouponService } from '../../coupons/src/v1/services/coupon.service';
import { MongooseConfigService } from 'apps/shared/services/mongoose-config.service';
// Modules
import { bullQueueModule } from '../../shared/dynamic-modules/bull.module';
//Consumers
import { DecodeDeepLinkConsumer } from './consumers/decode-deep-link.consumer';

@Module({
  imports: [
    bullQueueModule(`${process.env.REDIS_PREFIX}-decode-deep-link`),
    DeepLinkModule,
    MongooseModule.forRoot( process.env.DB_URI,
      {
        connectionName: 'coupons-deeplink',
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
    MongooseModule.forFeature(MongooseConfigService.getModels(['Coupon']), 'coupons-deeplink'),
  ],
  providers: [
    CouponService,
    DecodeDeepLinkService,
    // Consumer
    DecodeDeepLinkConsumer
  ],
})
export class AppModule {}
