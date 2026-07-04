import { Optional } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Validate } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne, brandsIdChecker } from "src/common/decorators/category.decorator";

export class createCategoryDTO {
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

}
@AtLeastOne(["name","slogan"])
export class updateCategoryDto extends PartialType(createCategoryDTO){

}
export class CategoryIdDto{
    @IsNotEmpty()
    @IsMongoId()
    CategoryId:Types.ObjectId
}

export class CategorysFilterDto{
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