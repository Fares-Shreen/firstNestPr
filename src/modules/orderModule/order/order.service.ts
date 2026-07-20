import { map } from 'rxjs/operators';
import { CouponRepository } from './../../../DB/repositories/couponrepository';
import { Coupon } from './../../../DB/models/coupon.model';
import { CartRepository } from './../../../DB/repositories/cart.repository';
import { ProductRepository } from './../../../DB/repositories/product.repository';
import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import orderRepository from 'src/DB/repositories/order.repository';
import { hydartedUserDoc } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { Types } from 'mongoose';
import { createOrderDTO } from '../orderDto';
import { orderStatusEnum, paymentMethodEnum } from 'src/common/enum/order.enum';
import { stripServce } from 'src/common/utils/services/stripe.service';

@Injectable()
export class orderService {
    constructor(
        private readonly OrderRepository: orderRepository,
        private readonly productRepository: ProductRepository,
        private readonly cartRepository: CartRepository,
        private readonly couponRepository: CouponRepository,
        private readonly StripServce: stripServce
    ) { }


    async createOrder(body: createOrderDTO, user: hydartedUserDoc) {
        const { address, paymentMethod, phone, couponCode } = body
        let coupon;
        if (couponCode) {
            coupon = await this.couponRepository.findOne({ filter: { code: couponCode.toLowerCase(), usedBy: { $nin: [user._id] } } })
            if (!coupon) {
                throw new BadRequestException("coupon not exist or already used")
            }
        }
        const cart = await this.cartRepository.findOne({ filter: { createdBy: user._id } })
        if (!cart || !cart.cartProducts.length) {
            throw new BadRequestException("User dont have cart or cart empty")
        }

        for (const product of cart.cartProducts) {
            const productExist = await this.productRepository.findOne({ filter: { _id: product.productId, stock: { $gte: product.quantity } } })
            if (!productExist) {
                throw new BadRequestException("product not exist or stock not cover order")
            }
        }

        const order = await this.OrderRepository.create({
            Address: address,
            phone,
            user: user._id,
            cart: cart._id,
            coupon: coupon ? coupon._id : undefined,
            paymentMethod,
            orderStatus: paymentMethod === paymentMethodEnum.CASH ? orderStatusEnum.PAID : orderStatusEnum.PENDING,
            Total_price: coupon ? cart.subTotal - (cart.subTotal * (coupon.amount / 100)) : cart.subTotal
        })

        if (!order) {
            throw new BadRequestException("order not completed plz try again")
        }

        for (const product of cart.cartProducts) {
            const productExist = await this.productRepository.findOneAndUpdate({ filter: { _id: product.productId }, update: { $inc: { stock: -product.quantity },$addToSet:{boughtBy:user._id} } })
            if (!productExist) {
                throw new BadRequestException("product not exist or stock not cover order")
            }
        }
        if (paymentMethod === paymentMethodEnum.CASH) {
            await this.cartRepository.findOneAndUpdate({ filter: { _id: cart._id }, update: { cartProducts: [], subTotal: 0 } })
        }

        if (coupon) {
            await this.couponRepository.findOneAndUpdate({ filter: { code: couponCode }, update: { $push: { usedBy: user._id } } })
        }
        return order
    }

    async createRefund(orderId:Types.ObjectId){
        if (!orderId) {
            throw new BadRequestException("orderId is needed")
        }

        const order = await this.OrderRepository.findOneAndUpdate({
            filter: { orderStatus: orderStatusEnum.PAID, _id: orderId, paymentMethod: paymentMethodEnum.ONLINE },
            update:{
                orderStatus:orderStatusEnum.REFUNDED,
                isRefunded:true
            }
        })

        if (!order) {
            throw new BadRequestException("This order may be not found")
        }

        const refunded = await this.StripServce.createRefundPayment(order.payment_intent)

        return {order,refunded}

    }

    async stripePayment(user: hydartedUserDoc, orderId: Types.ObjectId) {
        if (!orderId) {
            throw new BadRequestException("orderId is needed")
        }

        const order = await this.OrderRepository.findOne({
            filter: { orderStatus: orderStatusEnum.PENDING, _id: orderId, paymentMethod: paymentMethodEnum.ONLINE },
            options: {
                populate: [{
                    path: "cart",
                    populate:[{
                        path: "cartProducts.productId",
                    }]
                },
                {
                    path:"coupon"
                }
            ]
            }
        })

        if (!order) {
            throw new BadRequestException("This order may be not found")
        }
        let coupon : any;
        if (order.coupon) {
            console.log(order);
            
            coupon = await this.StripServce.createCoupon(order.coupon["amount"])
            console.log("-----------coupon--------",coupon);
            
        }

        const session = await this.StripServce.cheackOutSession({
            customer_email: user.email,
            metadata: {
                orderId: order._id.toString()
            },
            line_items: order.cart["cartProducts"].map((product: any) => {
                return {
                    price_data: {
                        currency: "egp",
                        product_data: {
                            name: product.productId.name
                        },
                        unit_amount: product.finalPrice * 100,
                    },
                    quantity: product.quantity
                }
            }),
            ...(coupon && {discounts:[{coupon:coupon.id}]})
        }
        )


        return session.url



    }

    async webhook(body:any){
        const orderId = body.data.object.metadata.orderId
        const payment_intent= body.data.object.payment_intent

        const order = await this.OrderRepository.findOneAndUpdate({filter:{_id:orderId},update:{
            orderStatus:orderStatusEnum.PAID,
            payment_intent:payment_intent
        }})
        if (!order) {
            throw new BadRequestException("There something go wrong during online payment")
        }
        const final_order = await this.OrderRepository.findOne({
            filter: { _id: orderId, paymentMethod: paymentMethodEnum.ONLINE },
            options: {
                populate: {
                    path: "cart"
                }
            
            }
        })
        await this.cartRepository.findOneAndUpdate({ filter: { _id:final_order?.cart._id }, update: { cartProducts: [], subTotal: 0 } })
        
        return order
    }


}
