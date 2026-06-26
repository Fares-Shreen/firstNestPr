import { BadGatewayException, CanActivate, ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { ACCESS_ROLES_KEY } from "../decorators/auth.decorator";



@Injectable()
export class AuthrizationGuard implements CanActivate {
    constructor(private reflector: Reflector) { }
    async canActivate(
        context: ExecutionContext,
    ): Promise<boolean> {
        try {

            let req: any;

            if (context.getType() === "http") {
                req = context.switchToHttp().getRequest()
            }
            else if (context.getType() === "rpc") {
                // req = context.switchToRpc()
            }
            else if (context.getType() === "ws") {
                // req = context.switchToWs()
            }

            const Roles = this.reflector.get(ACCESS_ROLES_KEY,context.getHandler()) as string []

            if (!Roles.includes(req.user.role)) {
                throw new UnauthorizedException("You are not authorized to acces that")     
            }
            


            return true;

        } catch (error) {
            throw new BadGatewayException("Unauthorized")
        }


    }
}
