import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { categoryModel } from 'src/DB/models/category.model';
import CategoryRepository from 'src/DB/repositories/category.repository';
import { BrandModel } from 'src/DB/models/brand.model';
import { userModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import UserRepository from 'src/DB/repositories/userRepository';
import { TokenService } from 'src/common/utils/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';

@Module({
  imports: [categoryModel,BrandModel,userModel],
  providers: [CategoryService, CategoryRepository,BrandRepository,UserRepository,TokenService,JwtService,CloudinaryTools],
  controllers: [CategoryController]
})
export class CategoryModule {}
