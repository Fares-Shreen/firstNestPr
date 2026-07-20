import { Module } from '@nestjs/common';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';
import { ReviewModel } from 'src/DB/models/review.model';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import { TokenService } from 'src/common/utils/services/token.service';
import { JwtService } from "@nestjs/jwt";
import ReviewRepository from 'src/DB/repositories/review.repository';
import userRepository from 'src/DB/repositories/userRepository';
import { userModel } from 'src/DB/models/user.model';
import ProductRepository from 'src/DB/repositories/product.repository';
import { ProductModel } from 'src/DB/models/product.model';

@Module({
  imports: [ReviewModel, userModel,ProductModel],
  controllers: [ReviewController],
  providers: [ReviewService, CloudinaryTools, TokenService, JwtService, ReviewRepository, userRepository,ProductRepository],
})
export class ReviewModule {

}
