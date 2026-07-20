import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { slugify } from "node_modules/zod/v4/core/util.cjs";
import { Brand } from "./brand.model";
import { User } from "./user.model";
import productRepository from "../repositories/product.repository";
import { Product } from "./product.model";

@Schema({
    _id: false, timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
class CartItem {
    @Prop({ type: Types.ObjectId, ref: Product.name, required: true })
    productId: Types.ObjectId;
    @Prop({ type: Number, required: true, min: 1 })
    quantity: number;
    @Prop({ type: Number, required: true })
    finalPrice: number;
}


@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class Cart {
    @Prop({ type: [CartItem] })
    cartProducts: CartItem[]
    @Prop({ type: Number, default: 0 })
    subTotal: number
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

export const CartSchema = SchemaFactory.createForClass(Cart)




CartSchema.pre(["find", "findOne"], function () {
    this.where({ isDeleted: false, deleteAt: null })
});


CartSchema.pre("save", function () {
    this.subTotal = this.cartProducts.reduce((total, product) => total + (product.finalPrice * product.quantity), 0)
})



export type hydartedCartDoc = HydratedDocument<Cart>
export const CartModel = MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }])