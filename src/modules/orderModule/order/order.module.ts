import { Module } from '@nestjs/common';
import { orderService } from './order.service';
import { orderController } from './order.controller';
import { OrderModel } from 'src/DB/models/order.model';
import orderRepository from 'src/DB/repositories/order.repository';
import { BrandModel } from 'src/DB/models/brand.model';
import { userModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import UserRepository from 'src/DB/repositories/userRepository';
import { TokenService } from 'src/common/utils/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import { CartModel } from 'src/DB/models/cart.model';
import { ProductModel } from 'src/DB/models/product.model';
import { CouponModel } from 'src/DB/models/coupon.model';
import CartRepository from 'src/DB/repositories/cart.repository';
import CouponRepository from 'src/DB/repositories/couponrepository';
import ProductRepository from 'src/DB/repositories/product.repository';
import { stripServce } from 'src/common/utils/services/stripe.service';

@Module({
  imports: [OrderModel,userModel,CartModel,ProductModel,CouponModel],
  providers: [orderService, orderRepository, UserRepository, TokenService, JwtService, CloudinaryTools, CartRepository, CouponRepository, ProductRepository, stripServce],
  controllers: [orderController]
})
export class orderModule { }
