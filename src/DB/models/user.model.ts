import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import { genderEnum } from "../../common/enum/user.enum";
import { HydratedDocument, Types } from "mongoose";
import { hash } from "src/common/utils/security/hash.security";
import { RoleEnum } from "src/common/enum/role.enum";


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
    @Prop({ type: String, required: true, enum: RoleEnum, default: RoleEnum.USER })
    role: string
    @Prop({ type: String })
    profilePic: string
    @Prop({ type: String, trim: true })
    address: string
    @Prop({ type: Date, default: Date.now() })
    changeCredentials: Date
    @Prop({ type: Boolean, default: false })
    confirmed: boolean
    @Prop({ type: [{ type: Types.ObjectId, ref: "Product" }] })
    whishList: Types.ObjectId[]
}

export const userSchema = SchemaFactory.createForClass(User)
userSchema.pre("save", function () {
    if (this.isModified("password")) {
        this.password = hash({ plainText: this.password })
    }
})

export type hydartedUserDoc = HydratedDocument<User>
export const userModel = MongooseModule.forFeature([{ name: User.name, schema: userSchema }])