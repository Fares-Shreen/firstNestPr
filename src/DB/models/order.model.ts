import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import  { HydratedDocument, Types } from "mongoose";
import { User } from "./user.model";
import { Cart } from "./cart.model";
import { orderStatusEnum, paymentMethodEnum } from "src/common/enum/order.enum";
import { Coupon } from "./coupon.model";




@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class Order {
    @Prop({ type: Types.ObjectId, ref: User.name, required: true })
    user: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref:Coupon.name})
    coupon: Types.ObjectId
    @Prop({ type: Types.ObjectId, required: true ,ref:Cart.name })
    cart: Types.ObjectId
    @Prop({ type: Number, required: true })
    Total_price: number
    @Prop({type:String , enum:paymentMethodEnum , required:true})
    paymentMethod: paymentMethodEnum
    @Prop({ type: String, enum: orderStatusEnum, required: true, default: orderStatusEnum.PENDING })
    orderStatus: orderStatusEnum
    @Prop({type:Date , default:() => new Date(new Date().getTime() + 3 * 24 * 60 * 60 * 1000)})
    arrivedAt:Date
    @Prop({type:Boolean,default:false})
    isRefunded:boolean
    @Prop({ type: Boolean, default: false })
    isCancelled: boolean
    @Prop({type:String ,required:true})
    phone:string
    @Prop({type:String,required:true})
    Address:string
    @Prop({type:String})
    payment_intent:string
}

export const OrderSchema = SchemaFactory.createForClass(Order)

OrderSchema.pre(["find", "findOne"], function () {
    this.where({ isDeleted: false, deleteAt: null })
});


export type hydartedOrderDoc = HydratedDocument<Order>
export const OrderModel = MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }])