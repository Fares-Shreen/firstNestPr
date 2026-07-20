import { Module } from '@nestjs/common';
import { SubCategoryService } from './subCategory.service';
import { subCategoryController } from './subCategory.controller';

import { BrandModel } from 'src/DB/models/brand.model';
import { userModel } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import UserRepository from 'src/DB/repositories/userRepository';
import { TokenService } from 'src/common/utils/services/token.service';
import { JwtService } from '@nestjs/jwt';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import { SubcategoryModel } from 'src/DB/models/subCategory.model';
import subCategoryRepository from 'src/DB/repositories/subCategory.repository';

@Module({
  imports: [SubcategoryModel, BrandModel, userModel],
  providers: [SubCategoryService, subCategoryRepository, BrandRepository, UserRepository, TokenService, JwtService, CloudinaryTools],
  controllers: [subCategoryController]
})
export class SubCategoryModule {}
