
import { Model } from "mongoose";
import baseRepository from "./baseRepository";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { Review } from "../models/review.model";

@Injectable()
export class ReviewRepository extends baseRepository<Review> {
    constructor(@InjectModel(Review.name) model: Model<Review>) {
        super(model);
    }
}

export default ReviewRepository;
