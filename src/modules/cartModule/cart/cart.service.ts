import { BadRequestException, ConflictException, Injectable, NotAcceptableException } from '@nestjs/common';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import CartRepository from 'src/DB/repositories/cart.repository';
import { hydartedUserDoc } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { Types } from 'mongoose';
import { CartIdDto, createCartDTO, updateQuantityDto } from '../cartDto';
import ProductRepository from 'src/DB/repositories/product.repository';

@Injectable()
export class CartService {
    constructor(private readonly CartRepository: CartRepository, private readonly cloudinaryTools: CloudinaryTools, private readonly brandsRepository: BrandRepository, private readonly productRepository: ProductRepository) { }

    async addToCartCart(user: hydartedUserDoc, CartData: createCartDTO) {

        const { productId, quantity } = CartData

        const product = await this.productRepository.findOne({ filter: { _id: productId, stock: { $gte: quantity } } })

        if (!product) {
            throw new NotAcceptableException("There is no product or stock not enough ")
        }

        const cart = await this.CartRepository.findOne({ filter: { createdBy: user._id }})
        let newCart;
        if (!cart) {
           newCart = this.CartRepository.create({
                createdBy:user._id,
                cartProducts:[{
                    productId:product._id,
                    quantity:quantity,
                    finalPrice: product.price
                }]
            }) 
            return newCart
        }

        const productExist = cart.cartProducts.find(product => product.productId.toString() === productId.toString())
        if (productExist) {
            throw new BadRequestException("This product already at cart")
        }
        cart.cartProducts.push({
            productId:product._id,
            quantity,
            finalPrice:product.price
        })
        await cart.save()
        return cart
    }
    async removeProductFromCart(user: hydartedUserDoc, CartData: CartIdDto) {

        const { productId } = CartData

        const product = await this.productRepository.findOne({ filter: { _id: productId} })

        if (!product) {
            throw new NotAcceptableException("There is no product")
        }

        const cart = await this.CartRepository.findOne({ filter: { createdBy: user._id , cartProducts: { $elemMatch: { productId: productId } } } })

        if (!cart) {
             throw new BadRequestException("cart not exist ")
        }

        cart.cartProducts = cart.cartProducts.filter(product => product.productId.toString() != productId.toString())

        await cart.save()
        return cart
    }

    async updateProductFromCart(user: hydartedUserDoc, CartData: CartIdDto, quantity: updateQuantityDto){
        const { productId } = CartData
        if (!quantity) {
            throw new BadRequestException("The quantity is needed")
        }

        const product = await this.productRepository.findOne({ filter: { _id: productId, stock: { $gte: quantity.quantity } } })

        if (!product) {
            throw new NotAcceptableException("There is no product")
        }

        const cart = await this.CartRepository.findOne({ filter: { createdBy: user._id } })

        if (!cart) {
            throw new BadRequestException("cart not exist ")
        }

        cart.cartProducts = cart.cartProducts.map(item => item.productId.toString() === productId.toString() ? { ...item, quantity: quantity.quantity} : item);

        await cart.save()
        return cart
    }



}
