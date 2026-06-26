import { SetMetadata } from "@nestjs/common";
import { tokenEnum } from "../enum/token.enum";
import { RoleEnum } from "../enum/role.enum";


export const TOKEN_TYPE_KEY = "tokentype"
export const ACCESS_ROLES_KEY ="accesroles"

export const tokenTypeDecorator = (tokenType: tokenEnum = tokenEnum.accessToken) => {
    return SetMetadata(TOKEN_TYPE_KEY, tokenType);
};
export const Roles = (access_roles: RoleEnum[])=>{
    return SetMetadata(ACCESS_ROLES_KEY, access_roles)
}