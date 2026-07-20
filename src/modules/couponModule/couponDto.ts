
import { PartialType } from "@nestjs/mapped-types";
import { Type } from "class-transformer";
import { IsDate, IsNotEmpty, IsNumber, IsPositive, IsString, Max, Min, Validate, validate } from "class-validator";
import { AtLeastOne, couponValidator } from 'src/common/decorators/coupon.decorator';

export class createCouponDTO {
    @IsNotEmpty()
    @IsPositive()
    @IsNumber()
    @Min(0)
    @Max(100)
    amount: number;
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    @Validate(couponValidator)
    fromDate: Date
    @IsNotEmpty()
    @IsDate()
    @Type(() => Date)
    toDate: Date
    @IsNotEmpty()
    @IsString()
    code: string
}
@AtLeastOne(["amount","fromDate","toDate"])
export class updateCouponDTO extends PartialType(createCouponDTO) {

}
export class couponCodeDto {
    @IsNotEmpty()
    @IsString()
    @Type(()=>String)
    code: string
}
