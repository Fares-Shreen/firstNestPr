
import { Model } from "mongoose";
import baseRepository from "./baseRepository";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Cart } from "../models/cart.model";

@Injectable()
export class CartRepository extends baseRepository<Cart> {
    constructor(@InjectModel(Cart.name) model: Model<Cart>) {
        super(model);
    }
}

export default CartRepository;
