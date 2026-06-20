import { User } from './../models/user.model';
import { Model } from "mongoose";
import baseRepository from "./baseRepository";
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';

@Injectable()
export class UserRepository extends baseRepository<User> {
    constructor(@InjectModel(User.name) model: Model<User>) {
        super(model);
    }
}

export default UserRepository;
