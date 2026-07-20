import { Optional } from "@nestjs/common";
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsEnum, IsMongoId, IsNotEmpty, IsNumber, IsOptional, IsPositive, IsString, Length, Validate } from "class-validator";
import { Types } from "mongoose";
import { AtLeastOne} from "src/common/decorators/order.decorator";
import { paymentMethodEnum } from "src/common/enum/order.enum";

export class createOrderDTO {
    @IsNotEmpty()
    @IsString()
    address: string;
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    phone: string;
    @IsNotEmpty()
    @IsString()
    @IsEnum(paymentMethodEnum)
    paymentMethod: paymentMethodEnum;
    @IsOptional()
    @IsNotEmpty()
    @IsString()
    @Type(() => String)
    couponCode: string
}

