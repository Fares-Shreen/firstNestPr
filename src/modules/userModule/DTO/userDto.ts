
import { HttpException } from "@nestjs/common"
import { IsEmail, IsInt, IsMongoId, IsNotEmpty, IsNumber, IsString, Length, registerDecorator, Validate, validate, ValidateIf, ValidationOptions } from "class-validator"
import z, { boolean } from "zod"

import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';
import { Types } from "mongoose";

@ValidatorConstraint({ name: 'customText', async: false })
export class passwordMatch implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        console.log({value,args});
        
        return value === args.object[args.constraints[0]]
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} not atch with ${args.constraints[0]}`;
    }
}
export function isMatch(constraints:string[],validationOptions?: ValidationOptions) {
    return function (object: Object, propertyName: string) {
        registerDecorator({
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            constraints,
            validator: passwordMatch,
        });
    };
}

export class createUserDto{
    @IsNotEmpty()
    @IsString()
    @Length(3,15,{message:"Too long naame"})
    userName:string
    @IsNotEmpty()
    @IsInt()
    age:number
    @IsNotEmpty()
    @IsEmail()
    email:string
    @IsNotEmpty()
    @IsString()
    password:string
    @IsNotEmpty()
    @IsString()
    @ValidateIf((data:createUserDto)=>{
        return Boolean(data.password)
    })
    @isMatch(["password"])
    cPassword:string
    @IsNotEmpty()
    @IsString()
    gender:string

}
export class signInDto {
    @IsNotEmpty()
    @IsEmail()
    email: string
    @IsNotEmpty()
    @IsString()
    password: string
}




// export const createUserSchema = z.strictObject({
//     name:z.string(),
//     age:z.number(),
//     email:z.email(),
//     password:z.string(),
//     cPassword:z.string()
// }).superRefine((args,ctx)=>{
//     if (args.password!==args.cPassword) {
//         ctx.addIssue({
//             code:"custom",
//             path:["cPassword"],
//             message:"password not similar ro cPassword"
//         })
//     }
// })