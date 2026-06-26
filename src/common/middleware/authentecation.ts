
import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction } from "express";
import { tokenEnum } from "../enum/token.enum";


@Injectable()
export class authenticationService implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        // isAthenticated = async (tokenType: tokenEnum = tokenEnum.accessToken) => {
        //     return async (req: Request, res: Response, next: NextFunction) => {
        //         const { authorization } = req.headers;
        //         console.log(authorization);

        //         if (!authorization) {
        //             throw new Error("No token found");
        //         }
        //         const [prefix, token] = authorization.split(" ");

        //         if (!token) {
        //             throw new Error("No token found");
        //         }

        //         const { ACCESS_SECRET_KEY, REFRESH_SECRET_KEY } = await accessSignature(prefix!)
        //         const secretKey = tokenType == tokenEnum.accessToken ? ACCESS_SECRET_KEY : REFRESH_SECRET_KEY
        //         const { user, decoded } = await decodeToken_fetchUser(token, secretKey)

        //         const revokeToken = await _redisService.getRedis(_redisService.revokedKey({ userId: user.id as string, jti: decoded.jti as string }));
        //         if (revokeToken) {
        //             throw new appError("Unauthenticated", 401);
        //         }

        //         req.user = user;
        //         req.decoded = decoded;

        //         next();
        //     }
        // }
        console.log('Request...');
        next();
    }

}