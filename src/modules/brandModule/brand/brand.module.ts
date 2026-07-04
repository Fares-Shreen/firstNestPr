import { Module } from '@nestjs/common';
import { BrandController } from './brand.controller';
import { BrandService } from './brand.service';
import { BrandModel } from 'src/DB/models/brand.model';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import { TokenService } from 'src/common/utils/services/token.service';
import { JwtService } from "@nestjs/jwt";
import brandRepository from 'src/DB/repositories/brand.repository';
import userRepository from 'src/DB/repositories/userRepository';
import { userModel } from 'src/DB/models/user.model';

@Module({
  imports: [BrandModel ,userModel],
  controllers: [BrandController],
  providers: [BrandService, CloudinaryTools, TokenService, JwtService, brandRepository, userRepository],
})
export class BrandModule {

}
