import { Optional } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Validate } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne, brandsIdChecker } from "src/common/decorators/product.decorator";
import is from "zod/v4/locales/is.js";

export class createProductDTO {
    @IsNotEmpty()
    @IsString()
    @Length(3, 60, { message: "Too long naame" })
    name: string;
    @IsNotEmpty()
    @IsString()
    @Length(3, 200, { message: "Too long naame" })
    description: string;
    @Validate(brandsIdChecker)
    @IsOptional()
    categoryId: Types.ObjectId

    @Validate(brandsIdChecker)
    @IsOptional()
    brandId: Types.ObjectId

    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    price: number
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    discount: number
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @Type(() => Number)
    stock: number
}
@AtLeastOne(["name","slogan"])
export class updateProductDto extends PartialType(createProductDTO){

}
export class ProductIdDto{
    @IsNotEmpty()
    @IsMongoId()
    ProductId:Types.ObjectId
}

export class ProductsFilterDto{
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Type(()=>Number)
    page:number
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @IsOptional()
    @Type(() => Number)
    limit:number
    @IsNotEmpty()
    @IsOptional()
    search:string
    


}