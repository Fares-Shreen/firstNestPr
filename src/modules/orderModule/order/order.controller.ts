import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { orderService } from './order.service';
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
import { createOrderDTO } from '../orderDto';
import { Types } from 'mongoose';


@Controller('order')
export class orderController {
    constructor(private readonly orderService: orderService) { }



    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Post("create")
    createorder(
        @User() user: hydartedUserDoc,
        @Body() body: createOrderDTO
    ) {
        {
            return this.orderService.createOrder(body, user);
        }

    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Post("stripe/:orderId")
    stripePayment(
        @User() user: hydartedUserDoc,
        @Param("orderId") orderId: Types.ObjectId
    ) {
        {
            return this.orderService.stripePayment( user , orderId);
        }

    }

    @Post("webhook")
    webhook(
        @Body() body: any
    ){
        return this.orderService.webhook(body)
    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Post("refund/:orderId")
    createRefund(@Param("orderId") orderId:Types.ObjectId){
        return this.orderService.createRefund(orderId)
    }



}