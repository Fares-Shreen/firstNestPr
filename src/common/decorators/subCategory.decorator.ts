import { registerDecorator, ValidationArguments, ValidationOptions, ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";
import { Types } from "mongoose";


export function AtLeastOne(requiredFields: string[], validationOptions?: ValidationOptions) {
    return function (constructor: Function) {
        registerDecorator({
            target: constructor,
            propertyName:"",
            options: validationOptions,
            constraints: requiredFields,
            validator: {
                validate(value: string, args: ValidationArguments) {
                    return requiredFields.some(field => args.object[field])
                },
                defaultMessage(args: ValidationArguments) {
                    return `At least on of ${requiredFields.join(" , ")} be sent `;
                }
            },
        });
    };
}

@ValidatorConstraint({ name: 'customText', async: false })
export class brandsIdChecker implements ValidatorConstraintInterface {
    validate(value: string[], args: ValidationArguments) {
        return value.filter(id=>Types.ObjectId.isValid(id)).length == value.length
    }

    defaultMessage(args: ValidationArguments) {
        return `${args.property} not atch with ${args.constraints[0]}`;
    }
}