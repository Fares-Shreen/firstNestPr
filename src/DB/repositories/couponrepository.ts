
import { Model } from "mongoose";
import baseRepository from "./baseRepository";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Coupon } from "../models/coupon.model";

@Injectable()
export class CouponRepository extends baseRepository<Coupon> {

    constructor(@InjectModel(Coupon.name) model: Model<Coupon>) {
        super(model);
    }
}

export default CouponRepository;
