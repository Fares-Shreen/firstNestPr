import { Optional } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Min, Validate } from "class-validator";
import { Types } from "mongoose";
// import { AtLeastOne, brandsIdChecker } from "src/common/decorators/cart.decorator";

export class createCartDTO {
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @Min(0)
    quantity: number;
    
    @IsMongoId()
    productId:Types.ObjectId

}
export class updateQuantityDto{
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @Min(0)
    quantity: number;
}
export class CartIdDto {
    @IsNotEmpty()
    @IsMongoId()
    productId: Types.ObjectId
}