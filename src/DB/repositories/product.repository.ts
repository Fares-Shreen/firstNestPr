
import { Model } from "mongoose";
import baseRepository from "./baseRepository";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Product } from "../models/product.model";

@Injectable()
export class ProductRepository extends baseRepository<Product> {
    constructor(@InjectModel(Product.name) model: Model<Product>) {
        super(model);
    }
}

export default ProductRepository;
