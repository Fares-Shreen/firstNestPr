
import { UserService } from './user.service';
import { Body, Controller, Get, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { createUserDto, signInDto} from './DTO/userDto';




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
    getUser(){
        return this.userService.getUser()
    }
    @Post("signIn")
    signIn(@Body() body: signInDto): any {
        return this.userService.signIn(body)
    }

}