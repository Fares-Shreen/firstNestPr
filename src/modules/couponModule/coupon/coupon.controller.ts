import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { couponService } from './coupon.service';
import { Roles, tokenTypeDecorator } from 'src/common/decorators/auth.decorator';
import { tokenEnum } from 'src/common/enum/token.enum';
import { RoleEnum } from 'src/common/enum/role.enum';
import { AuthGuard } from 'src/common/guards/authentecation.guard';
import { AuthrizationGuard } from 'src/common/guards/authorizaton.guard';
import type { hydartedUserDoc } from 'src/DB/models/user.model';
import { User } from 'src/common/decorators/user.decorator';
import { couponCodeDto, createCouponDTO, updateCouponDTO } from '../couponDto';


@Controller('coupon')
export class couponController {
    constructor(private readonly couponService: couponService) { }

    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Post("createCoupon")
    createcoupon(
        @User() user: hydartedUserDoc,
        @Body() couponData: createCouponDTO
    ) {
            return this.couponService.createCoupon(user, couponData);
    }

    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Get("/:code")
    getcoupon(
        @Param() param: couponCodeDto
    ){    
        return this.couponService.getCoupon(param)
    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Delete("/:code")
    deletecoupon(
        @Param() param: couponCodeDto
    ) {
        return this.couponService.deleteCoupon(param)
    }

    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Patch("update/:code")
    udpateCoupon(@Param() code:couponCodeDto,@Body() body:updateCouponDTO,@User() user:hydartedUserDoc){
        return this.couponService.updateCoupon(user,body,code)
    }   




    // @tokenTypeDecorator(tokenEnum.accessToken)
    // @Roles([RoleEnum.USER])
    // @UseGuards(AuthGuard, AuthrizationGuard)
    // @Delete("remove-from-coupon/:productId")
    // deleteItemFromcoupon(
    //     @Param() Params: couponIdDto,
    //     @User() user: hydartedUserDoc
    // ) {
    //     {
    //         return this.couponService.removeProductFromcoupon(user, Params);
    //     }
    // }
    // @tokenTypeDecorator(tokenEnum.accessToken)
    // @Roles([RoleEnum.USER])
    // @UseGuards(AuthGuard, AuthrizationGuard)
    // @Patch("update-quantity-product-coupon/:productId")
    // updateQuantityOfProductcoupon(
    //     @Param() Params: couponIdDto,
    //     @User() user: hydartedUserDoc,
    //     @Body() body: updateQuantityDto
    // ) {
    //     {
    //         return this.couponService.updateProductFromcoupon(user, Params, body);
    //     }
    // }


    // @tokenTypeDecorator(tokenEnum.accessToken)
    // @Roles([RoleEnum.USER])
    // @UseGuards(AuthGuard, AuthrizationGuard)
    // @Patch("update/:couponId")
    // updatecoupon(
    //     @Param() Params: couponIdDto,
    //     @User() user: hydartedUserDoc,
    //     @Body() couponData: updatecouponDto) {

    //     return this.couponService.updatecoupon(user, couponData, Params.couponId);

    // }
    // @Get("")

    // getcoupons(
    //     @Query() Query: couponsFilterDto,
    // ) {
    //     return this.couponService.getcoupons(Query);
    // }

    // @Patch("soft-delete/:couponId")
    // softDeletecoupon(@Param() Params: couponIdDto) {
    //     return this.couponService.softDeletecoupon(Params)
    // }
    // @Patch("restore-soft-delete/:couponId")
    // restoreSoftDeletecoupon(@Param() Params: couponIdDto) {
    //     return this.couponService.restoreSoftDeletecoupon(Params)
    // }
    // @Delete("delete/:couponId")
    // Deletecoupon(@Param() Params: couponIdDto) {
    //     return this.couponService.deletecoupon(Params)
    // }
}
