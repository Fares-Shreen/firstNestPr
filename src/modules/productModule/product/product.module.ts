import { Product, ProductModel } from './../../../DB/models/product.model';
import { Module } from '@nestjs/common';
import {  ProductService } from './product.service';
import {  ProductController } from './product.controller';
import { categoryModel } from 'src/DB/models/category.model';
import CategoryRepository from 'src/DB/repositories/category.repository';
import { BrandModel } from 'src/DB/models/brand.model';
import { userModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import UserRepository from 'src/DB/repositories/userRepository';
import { TokenService } from 'src/common/utils/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import ProductRepository from 'src/DB/repositories/product.repository';

@Module({
  imports: [categoryModel, BrandModel, userModel,ProductModel],
  providers: [ProductService, CategoryRepository, BrandRepository, UserRepository, TokenService, JwtService, CloudinaryTools,ProductRepository],
  controllers: [ProductController]
})
export class ProductModule { }
