import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CartService } from './cart.service';
import { Roles, tokenTypeDecorator } from 'src/common/decorators/auth.decorator';
import { tokenEnum } from 'src/common/enum/token.enum';
import { RoleEnum } from 'src/common/enum/role.enum';
import { AuthGuard } from 'src/common/guards/authentecation.guard';
import { AuthrizationGuard } from 'src/common/guards/authorizaton.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { multer_enum, store_type_enum } from 'src/common/enum/multer.enum';
import { multerCloud } from 'src/common/middleware/multer.cloud';
import type { hydartedUserDoc } from 'src/DB/models/user.model';
import { User } from 'src/common/decorators/user.decorator';
import {  CartIdDto, createCartDTO, updateQuantityDto } from '../cartDto';

@Controller('cart')
export class CartController {
    constructor(private readonly cartService: CartService) { }

    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Post("add-to-cart")
    createCart(
        @User() user: hydartedUserDoc,
        @Body() CartData: createCartDTO
    ) {
        {
            return this.cartService.addToCartCart( user, CartData);
        }
    }


    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Delete("remove-from-cart/:productId")
    deleteItemFromCart(
        @Param() Params: CartIdDto,
        @User() user: hydartedUserDoc
    ) {
        {
            return this.cartService.removeProductFromCart(user, Params);
        }
    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Patch("update-quantity-product-cart/:productId")
    updateQuantityOfProductCart(
        @Param() Params: CartIdDto,
        @User() user: hydartedUserDoc,
        @Body() body:updateQuantityDto
    ) {
        {
            return this.cartService.updateProductFromCart(user, Params,body);
        }
    }


    // @tokenTypeDecorator(tokenEnum.accessToken)
    // @Roles([RoleEnum.USER])
    // @UseGuards(AuthGuard, AuthrizationGuard)
    // @Patch("update/:CartId")
    // updateCart(
    //     @Param() Params: CartIdDto,
    //     @User() user: hydartedUserDoc,
    //     @Body() CartData: updateCartDto) {

    //     return this.cartService.updateCart(user, CartData, Params.CartId);

    // }
    // @Get("")

    // getCarts(
    //     @Query() Query: CartsFilterDto,
    // ) {
    //     return this.cartService.getCarts(Query);
    // }

    // @Patch("soft-delete/:CartId")
    // softDeleteCart(@Param() Params: CartIdDto) {
    //     return this.cartService.softDeleteCart(Params)
    // }
    // @Patch("restore-soft-delete/:CartId")
    // restoreSoftDeleteCart(@Param() Params: CartIdDto) {
    //     return this.cartService.restoreSoftDeleteCart(Params)
    // }
    // @Delete("delete/:CartId")
    // DeleteCart(@Param() Params: CartIdDto) {
    //     return this.cartService.deleteCart(Params)
    // }
}
