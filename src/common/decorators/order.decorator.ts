import {registerDecorator, ValidationArguments,  ValidationOptions,  ValidatorConstraint, ValidatorConstraintInterface } from "class-validator";



@ValidatorConstraint({ name: 'customText', async: false })
export class couponValidator implements ValidatorConstraintInterface {
    validate(value: string, args: ValidationArguments) {
        const obj = args.object as any
        const fromDate = new Date(obj.fromDate)
        const toDate = new Date(obj.toDate) 
        const currentDate = new Date()
        return  fromDate>currentDate && toDate>fromDate
    }

    defaultMessage(args: ValidationArguments) {
        return `fromDate must be more than now and to date must also be greater than from date `;
    }
}


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