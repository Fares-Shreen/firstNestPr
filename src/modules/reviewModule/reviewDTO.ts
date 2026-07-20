import { Optional } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Max, Min } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorators/review.decorat";

export class createReviewDTO {
    @IsNotEmpty()
    @IsNumber()
    @Min(1)
    @Max(5)
    rate_number: number;
    @IsString()
    contentReview: string;
    @IsNotEmpty()
    @IsMongoId()
    productId: Types.ObjectId
}
@AtLeastOne(["rate_number","contentReview"])
export class updateReviewDto extends PartialType(createReviewDTO){

}
export class ReviewIdDto{
    @IsNotEmpty()
    @IsMongoId()
    ReviewId:Types.ObjectId
}

// export class ReviewsFilterDto{
//     @IsNotEmpty()
//     @IsPositive()
//     @IsNumber()
//     @IsOptional()
//     @Type(()=>Number)
//     page:number
//     @IsNotEmpty()
//     @IsPositive()
//     @IsNumber()
//     @IsOptional()
//     @Type(() => Number)
//     limit:number
//     @IsNotEmpty()
//     @IsOptional()
//     search:string
// }