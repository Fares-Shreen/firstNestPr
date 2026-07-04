


import { Injectable, CanActivate, ExecutionContext, BadGatewayException, UnauthorizedException } from '@nestjs/common';
import { Observable } from 'rxjs';
import { TokenService } from '../utils/services/token.service';
import { tokenEnum } from '../enum/token.enum';
import { Reflector } from '@nestjs/core';
import redisService from '../cache/redis.service';
import { TOKEN_TYPE_KEY } from '../decorators/auth.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
    constructor(private readonly tokenService: TokenService, private reflector: Reflector) { }
     async canActivate(
        context: ExecutionContext, 
    ): Promise<boolean> {
        try {
            let req: any
            let authorization: any

            if (context.getType() === "http") {
                req = context.switchToHttp().getRequest()
                authorization = await req.headers.authorization
            }
            else if (context.getType() === "rpc") {
                // req = context.switchToRpc()
            }
            else if (context.getType() === "ws") {
                // req = context.switchToWs()
            }

            if (!authorization) {
                throw new UnauthorizedException("No token found");
            }
            const [prefix, token] = authorization.split(" ");
            if (!token) {
                throw new Error("No token found");
            }
            const tokenType = this.reflector.get(TOKEN_TYPE_KEY, context.getHandler())

            const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = await this.tokenService.accessSignature(prefix!)
            const secretKey = tokenType == tokenEnum.accessToken ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY
            const { user, decoded } = await this.tokenService.decodeToken_fetchUser(token, secretKey)

            // const revokeToken = await this._redisService.getRedis(this._redisService.revokedKey({ userId: user.id as string, jti: decoded.jti as string }));
            // if (revokeToken) {
            //     throw new BadGatewayException("Unauthenticated");
            // }

            req.user = user;
            req.decoded = decoded;
            console.log(decoded);

            return true; 
        } catch (error) {
            throw new UnauthorizedException("Token is needed")
        }
    }
        
    }

