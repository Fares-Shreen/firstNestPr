
import { Model } from "mongoose";
import baseRepository from "./baseRepository";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { SubCategory } from "../models/subCategory.model";

@Injectable()
export class SubCategoryRepository extends baseRepository<SubCategory> {
    constructor(@InjectModel(SubCategory.name) model: Model<SubCategory>) {
        super(model);
    }
}

export default SubCategoryRepository;
