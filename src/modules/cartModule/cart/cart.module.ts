import { Module } from '@nestjs/common';

import { categoryModel } from 'src/DB/models/category.model';
import CategoryRepository from 'src/DB/repositories/category.repository';
import { BrandModel } from 'src/DB/models/brand.model';
import { userModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import UserRepository from 'src/DB/repositories/userRepository';
import { TokenService } from 'src/common/utils/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import CartRepository from 'src/DB/repositories/cart.repository';
import { CartModel } from 'src/DB/models/cart.model';
import { CartController } from './cart.controller';
import { CartService } from './cart.service';
import ProductRepository from 'src/DB/repositories/product.repository';
import { ProductModel } from 'src/DB/models/product.model';

@Module({
  imports: [categoryModel, BrandModel, userModel,CartModel ,ProductModel],
  providers: [ CategoryRepository, BrandRepository, UserRepository, TokenService, JwtService, CloudinaryTools,CartRepository,CartService,ProductRepository],
  controllers: [CartController]
})
export class CartModule { }
