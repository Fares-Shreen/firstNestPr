import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { slugify } from "node_modules/zod/v4/core/util.cjs";
import { Brand } from "./brand.model";
import { User } from "./user.model";
import productRepository from "../repositories/product.repository";




@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class Coupon {
    @Prop({ type: [{ type: Types.ObjectId, ref: User.name }] })
    usedBy: Types.ObjectId[]
    @Prop({ type: String, required: true, unique: true, toLowerCase:true })
    code: string
    @Prop({ type: Number, max: 100, min: 0, required: true })
    amount: number
    @Prop({ type: Date, required: true })
    fromDate: Date
    @Prop({ type: Date, required: true })
    toDate: Date
    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    createdBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId
    @Prop({ type: Date, default: null })
    deleteAt: Date
    @Prop({ type: Boolean, default: false })
    isDeleted: boolean
}

export const CouponSchema = SchemaFactory.createForClass(Coupon)

CouponSchema.pre(["find", "findOne"], function () {
    this.where({ isDeleted: false, deleteAt: null })
});


export type hydartedCouponDoc = HydratedDocument<Coupon>
export const CouponModel = MongooseModule.forFeature([{ name: Coupon.name, schema: CouponSchema }])