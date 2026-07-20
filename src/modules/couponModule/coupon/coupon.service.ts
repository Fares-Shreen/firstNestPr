import { BadRequestException, ConflictException, Injectable, NotAcceptableException } from '@nestjs/common';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';

import { hydartedUserDoc } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { Types } from 'mongoose';
import ProductRepository from 'src/DB/repositories/product.repository';
import CouponRepository from 'src/DB/repositories/couponrepository';
import { couponCodeDto, createCouponDTO, updateCouponDTO } from '../couponDto';

@Injectable()
export class couponService {
    constructor(private readonly couponRepository: CouponRepository) { }

    async createCoupon (user:hydartedUserDoc,couponData:createCouponDTO){

        const { fromDate, toDate , amount , code } = couponData
        const couponExist = await this.couponRepository.findOne({filter:{code:code}})
        if (couponExist) {
            throw new BadRequestException("This coupon alreadye exist")
        }

        const coupon =await this.couponRepository.create({
            code,
            amount,
            toDate,
            fromDate,
            createdBy:user._id
        })
        return coupon
    }

    async getCoupon(param: couponCodeDto){
        const {code} = param
        if (!code) {
            throw new BadRequestException("Code must be sent")
        }
        const coupon = await this.couponRepository.find({filter:{code:code}})
        return coupon
    }

    async updateCoupon(user: hydartedUserDoc, couponData: updateCouponDTO, code: couponCodeDto) {

        const { fromDate, toDate, amount} = couponData
        const coupon = await this.couponRepository.findOneAndUpdate({
            filter: { code: code.code }, update: {
                amount,
                toDate,
                fromDate,
                updatedBy: user._id
            }
        })
        if (!coupon) {
            throw new BadRequestException("This coupon alreadye exist")
        }
        return coupon
    }

    async deleteCoupon(param: couponCodeDto){
        const { code } = param
        if (!code) {
            throw new BadRequestException("Code must be sent")
        }
        const coupon = await this.couponRepository.Delete({ filter: { code: code} })
        if (!coupon) {
            throw new BadRequestException("coupon not exist")
        }
        return {message:`coupon ${code} deleted successfully`}
    }


}
