import * as dotenv from 'dotenv';
dotenv.config();

import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
// Modules
import { AppModule } from './app.module';

/**
 * Catch all unhandled rejection
 *  @return {void}
 */
process.on('unhandledRejection', (err: NodeJS.ErrnoException) => {
  Logger.error(err.message, err.stack);
  process.exit(1);
});

/**
 * Catch all uncaught exceptions
 *  @return {void}
 */
process.on('uncaughtException', (err: NodeJS.ErrnoException) => {
  Logger.error(err.message, err.stack);
  process.exit(1);
});

/**
 * Catch SIGINT
 * @return {void}
 */
process.on('SIGINT', () => {
  Logger.error('SIGINT signal received.');
  process.exit(1);
});


async function bootstrap() {
  const port = +process.env.DECODE_DEEP_LINK_APP_PORT || 3021;
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options: {
        port
      }
    },
  );

  await app.listen(() => Logger.log(`Application deep link decode started on port ${port}`, 'Bootstrap'));
}

bootstrap().then(() => Logger.log('Application build complete', 'Bootstrap'));
