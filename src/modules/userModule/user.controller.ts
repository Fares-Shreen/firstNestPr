
import { UserService } from './user.service';
import { Body, Controller, Get, Param, Patch, Post, Req, SetMetadata, UploadedFile, UploadedFiles, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from "@nestjs/common";
import { createUserDto, signInDto} from './DTO/userDto';
import { tokenEnum } from 'src/common/enum/token.enum';
import { Roles, tokenTypeDecorator } from 'src/common/decorators/auth.decorator';
import { AuthGuard } from 'src/common/guards/authentecation.guard';
import { RoleEnum } from 'src/common/enum/role.enum';
import { AuthrizationGuard } from 'src/common/guards/authorizaton.guard';
import { User } from 'src/common/decorators/user.decorator';
import * as userModel from 'src/DB/models/user.model';
import { LoggingInterceptor } from 'src/common/interceptors/logger.interceptor';
import { multer_enum , store_type_enum} from 'src/common/enum/multer.enum';
import { multerCloud } from 'src/common/middleware/multer.cloud';
import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Types } from 'mongoose';





@Controller("user")
    @UsePipes(new ValidationPipe({
        whitelist: true,
        forbidNonWhitelisted: true
    }))
export class UserController {
    constructor(private readonly userService:UserService){}

    @Post("signUp")
    signUp(@Body() body:createUserDto ):any{
        return this.userService.signUp(body)
    }

    @Get()

    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard,AuthrizationGuard)
    getUser(){
        return this.userService.getUser()
    }
    @Post("signIn")

    signIn(@Body() body: signInDto): any {
        return this.userService.signIn(body)
    }
    
    @Get("profile")
    @tokenTypeDecorator(tokenEnum.accessToken)
    @UseGuards(AuthGuard)
    getUserProfile(@User() user:userModel.hydartedUserDoc) {
        return {user}
    }

    @Post("uploadProfilePic")
    @tokenTypeDecorator(tokenEnum.accessToken)
    @UseGuards(AuthGuard)
    @UseInterceptors(FileInterceptor("file", multerCloud({ custom_types: multer_enum.image, store_type: store_type_enum.disk })))
    uploadProfilePic(@UploadedFile() file:Express.Multer.File) {
        console.log("file",file);
        return this.userService.uploadProfilePic(file)
    }

    @Patch("wishlist/:productId")
    @tokenTypeDecorator(tokenEnum.accessToken)
    @UseGuards(AuthGuard)
    wishlistActions(@User() user: userModel.hydartedUserDoc, @Param("productId") productId:Types.ObjectId) {
        console.log(productId)
        return this.userService.add_remove_from_wishlist(user, productId)
    }


}