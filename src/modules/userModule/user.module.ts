import { MiddlewareConsumer, Module, NestModule, RequestMethod } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import UserRepository from "src/DB/repositories/userRepository";
import { userModel } from "src/DB/models/user.model";
import redisService from "src/common/cache/redis.service";
import { RedisModule } from "src/common/cache/redis.module";
import { TokenService } from "src/common/utils/services/token.service";
import { JwtService } from "@nestjs/jwt";
import { LoggerMiddleware } from "src/common/middleware/logger.middleware";
import { authenticationService } from "src/common/middleware/authentecation";
import { CloudinaryTools } from "src/common/utils/cloudinary/clodinary.tools";


@Module({
  imports: [userModel, RedisModule],
  controllers: [UserController],
  providers: [TokenService, UserService, UserRepository, redisService, JwtService,
    CloudinaryTools
  ],
  exports: []
})
export class UserModule {}
