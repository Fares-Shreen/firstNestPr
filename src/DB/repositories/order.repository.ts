
import { Model } from "mongoose";
import baseRepository from "./baseRepository";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Order } from "../models/order.model";

@Injectable()
export class OrderRepository extends baseRepository<Order> {
    constructor(@InjectModel(Order.name) model: Model<Order>) {
        super(model);
    }
}

export default OrderRepository;
