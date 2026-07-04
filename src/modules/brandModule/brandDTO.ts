import { Optional } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne } from "src/common/decorators/brand.decorator";

export class createBrandDTO {
    @IsNotEmpty()
    @IsString()
    @Length(3, 60, { message: "Too long naame" })
    name: string;
    @IsString()
    slogan: string;
    @IsNotEmpty()
    @IsMongoId()
    categoryId: Types.ObjectId
}
@AtLeastOne(["name","slogan"])
export class updateBrandDto extends PartialType(createBrandDTO){

}
export class brandIdDto{
    @IsNotEmpty()
    @IsMongoId()
    brandId:Types.ObjectId
}

export class brandsFilterDto{
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