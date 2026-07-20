import { Module } from '@nestjs/common';
import { userModel } from 'src/DB/models/user.model';
import UserRepository from 'src/DB/repositories/userRepository';
import { TokenService } from 'src/common/utils/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { couponController } from './coupon.controller';
import ProductRepository from 'src/DB/repositories/product.repository';
import { ProductModel } from 'src/DB/models/product.model';
import { CouponModel } from 'src/DB/models/coupon.model';
import CouponRepository from 'src/DB/repositories/couponrepository';
import { couponService } from './coupon.service';

@Module({
  imports: [ userModel, ProductModel,CouponModel],
  providers: [UserRepository, TokenService, JwtService,  ProductRepository, CouponRepository,couponService],
  controllers: [couponController]
})
export class couponModule { }
