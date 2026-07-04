
import { Model } from "mongoose";
import baseRepository from "./baseRepository";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Brand } from "../models/brand.model";

@Injectable()
export class BrandRepository extends baseRepository<Brand> {
    constructor(@InjectModel(Brand.name) model: Model<Brand>) {
        super(model);
    }
}

export default BrandRepository;
