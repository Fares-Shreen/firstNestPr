import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { UserRoleEnum, genderEnum } from "../../common/enum/user.enum";
import { HydratedDocument } from "mongoose";
import { hash } from "src/common/utils/security/hash.security";


@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class User {
    @Prop({ type: String, required: true, min: 5 })
    userName: string
    @Prop({ type: String, required: true, unique: true })
    email: string
    @Prop({ type: String, required: true, min: 8, trim: true })
    password: string
    @Prop({ type: Number, required: true })
    age: number
    @Prop({ type: String, required: true, enum: genderEnum, default: genderEnum.MALE })
    gender: string
    @Prop({ type: String, required: true, enum: UserRoleEnum, default: UserRoleEnum.USER })
    role: string
    @Prop({ type: String })
    profilePic: string
    @Prop({ type: String, trim: true })
    address: string
}

export const userSchema = SchemaFactory.createForClass(User)
userSchema.pre("save", function () {
    if (this.isModified("password")) {
        this.password = hash({ plainText: this.password })
    }
})
export type hydartedUserDoc = HydratedDocument<User>
export const userModel = MongooseModule.forFeature([{ name: User.name, schema: userSchema }])