import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Roles, tokenTypeDecorator } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { multer_enum, store_type_enum } from 'src/common/enum/multer.enum';
import { RoleEnum } from 'src/common/enum/role.enum';
import { tokenEnum } from 'src/common/enum/token.enum';
import { AuthGuard } from 'src/common/guards/authentecation.guard';
import { AuthrizationGuard } from 'src/common/guards/authorizaton.guard';
import { multerCloud } from 'src/common/middleware/multer.cloud';
import type { hydartedUserDoc } from 'src/DB/models/user.model';
import {  createReviewDTO, ReviewIdDto, updateReviewDto } from '../reviewDTO';
import { ReviewService } from './review.service';

@Controller('review')
@UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
}))
export class ReviewController {
    constructor(private readonly ReviewService: ReviewService) { }

    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Post("create-review")
    createReview(
        @User() user: hydartedUserDoc,
        @Body() ReviewData: createReviewDTO
    ) {
        {
            return this.ReviewService.createReview( user, ReviewData);
        }

    }
    // @tokenTypeDecorator(tokenEnum.accessToken)
    // @Roles([RoleEnum.USER])
    // @UseGuards(AuthGuard, AuthrizationGuard)
    // @Patch("update/:ReviewId")
    // updateReview(
    //     @Param() Params: ReviewIdDto,
    //     @User() user: hydartedUserDoc,
    //     @Body() ReviewData: updateReviewDto) {

    //     return this.ReviewService.updateReview(user, ReviewData, Params.ReviewId);

    // }
    // // @tokenTypeDecorator(tokenEnum.accessToken)
    // // @Roles([RoleEnum.USER])
    // // @UseGuards(AuthGuard, AuthrizationGuard)`
    // @Get("")

    // getReviews(
    //     @Query() Query: ReviewsFilterDto,
    // ) {
    //     return this.ReviewService.getReviews(Query);
    // }

    // @Patch("soft-delete/:ReviewId")
    // softDeleteReview(@Param() Params: ReviewIdDto) {
    //     return this.ReviewService.softDeleteReview(Params)
    // }
    // @Patch("restore-soft-delete/:ReviewId")
    // restoreSoftDeleteReview(@Param() Params: ReviewIdDto) {
    //     return this.ReviewService.restoreSoftDeleteReview(Params)
    // }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Delete("delete/:ReviewId")
    DeleteReview(@Param() Params: ReviewIdDto, @User() user: hydartedUserDoc,) {
        return this.ReviewService.deleteReview(Params,user)
    }


}
