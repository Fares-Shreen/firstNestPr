import { Optional } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Validate } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne, brandsIdChecker } from "src/common/decorators/subCategory.decorator";

export class createSubCategoryDTO {
    @IsNotEmpty()
    @IsString()
    @Length(3, 60, { message: "Too long naame" })
    name: string;
    @IsOptional()
    @IsString()
    slogan: string;
    @Validate(brandsIdChecker)
    @IsOptional()
    brandsId: Types.ObjectId[]


        @Validate(brandsIdChecker)
        @IsOptional()
        categoryId: Types.ObjectId


}
@AtLeastOne(["name","slogan"])
export class updateSubCategoryDto extends PartialType(createSubCategoryDTO){

}
export class SubCategoryIdDto{
    @IsNotEmpty()
    @IsMongoId()
    SubCategoryId:Types.ObjectId
}

export class SubCategorysFilterDto{
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