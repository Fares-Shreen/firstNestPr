import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './modules/userModule/user.module';
import { Connection } from 'mongoose';
import { ConfigModule } from '@nestjs/config';
import redisService from './common/cache/redis.service';
import { RedisModule } from './common/cache/redis.module';
import { BrandModule } from './modules/brandModule/brand/brand.module';
import { CategoryModule } from './modules/categoryModule/category/category.module';
import { ProductModule } from './modules/productModule/product/product.module';

@Module({
  imports: [ConfigModule.forRoot({
    envFilePath:[".env.development",".env.production"],
  }) ,MongooseModule.forRoot(process.env.DBURL!, {
    onConnectionCreate: (connection: Connection) => {
    connection.on('connected', () => console.log('connected'));
    connection.on('open', () => console.log('open'));
    connection.on('disconnected', () => console.log('disconnected'));
    connection.on('reconnected', () => console.log('reconnected'));
    connection.on('disconnecting', () => console.log('disconnecting'));
    return connection;
    }
  }),UserModule,RedisModule,BrandModule,CategoryModule,ProductModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
