import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import UserRepository from "src/DB/repositories/userRepository";
import { userModel } from "src/DB/models/user.model";
import redisService from "src/common/cache/redis.service";
import { RedisModule } from "src/common/cache/redis.module";
import { TokenService } from "src/common/utils/security/token.service";
import { JwtService } from "@nestjs/jwt";

@Module({
  imports: [userModel,RedisModule],
  controllers: [UserController],
  providers: [TokenService, UserService, UserRepository, redisService, JwtService],
  exports:[]
})
export class UserModule{

}