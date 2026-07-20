import { ProductRepository } from 'src/DB/repositories/product.repository';
import { BadRequestException, ConflictException, Injectable, Query, Param } from '@nestjs/common';
import { ReviewRepository } from 'src/DB/repositories/review.repository';
import {  createReviewDTO, ReviewIdDto, updateReviewDto } from '../reviewDTO';
import { hydartedUserDoc } from 'src/DB/models/user.model';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import { Types } from 'mongoose';

@Injectable()
export class ReviewService {
    constructor(private readonly ReviewRepository: ReviewRepository, private readonly cloudinaryTools: CloudinaryTools,private readonly productRepository:ProductRepository) { }

    async createReview( user: hydartedUserDoc, ReviewData: createReviewDTO) {
        const { rate_number,contentReview,productId } = ReviewData;
        if (!await this.productRepository.findOne({ filter: {_id:productId,boughtBy:{$in:[user._id]}} })) {
            throw new BadRequestException("You must buy this product to make review on it");
        }
        if (await this.ReviewRepository.findOne({filter:{createdBy:user._id}})) {
            throw new BadRequestException("You already make review on that porduct to can update it or delete it");
        }

        const Review = await this.ReviewRepository.create({
            rate_number:rate_number,
            contentReview,
            productId:Types.ObjectId.createFromHexString(productId as any),
            createdBy: user._id
        });
        if (!Review) {
            throw new BadRequestException("Failed to create Review");
        }
        console.log(productId);
        
        const result = await this.ReviewRepository.aggregate([
            {
                $match: {
                    productId: Types.ObjectId.createFromHexString(productId as any),
                },
            },
            {
                $group: {
                    _id: "$productId",
                    avg_rate: { $avg: "$rate_number" },
                    rate_number: { $sum: 1 },
                },
            },
        ]);
        console.log(result);
        

        const ll = await this.productRepository.findOneAndUpdate({
            filter: { _id:Types.ObjectId.createFromHexString(productId as any) }, update:{
            avg_rate: result[0]?.avg_rate ?? 0,
            rate_number: result[0]?.rate_number ?? 0,
        }}
        );
        // console.log(ll);
        


        return Review;
    }

    // async updateReview(user: hydartedUserDoc, ReviewData: updateReviewDto, ReviewId: Types.ObjectId) {
    //     console.log(ReviewData)
    //     const { name, slogan } = ReviewData;
    //     const Review = await this.ReviewRepository.findOne({ filter: { _id: ReviewId } })
    //     if (!Review) {
    //         throw new BadRequestException("Review doasnot exist");
    //     }
    //     if (name && Review.name == name) {
    //         throw new ConflictException("Review already exist");
    //     }
    //     if (name && await this.ReviewRepository.findOne({ filter: { name: name } })) {
    //         throw new ConflictException("Review already exist");
    //     }

    //     const updatedReview = await this.ReviewRepository.findOneAndUpdate({
    //         filter: { _id: ReviewId }, update: {
    //             name: name ? name : undefined,
    //             slogan: slogan ? slogan : undefined,
    //             updatedBy: user.id
    //         }
    //     })

    //     return updatedReview
    // }

    // async getReviews(Query: ReviewsFilterDto) {
    //     const { page, limit, search } = Query
    //     const Reviews = await this.ReviewRepository.pagination({
    //         page,
    //         limit,
    //         populate: [
    //             {
    //                 path: "product"
    //             }
    //         ],
    //         search: search ? {
    //             $or: [
    //                 { name: { $regex: search, $options: "i" } },
    //                 { slogan: { $regex: search, $options: "i" } }
    //             ]
    //         } : {}
    //     });
    //     return Reviews;
    // }
    // async softDeleteReview(Param: ReviewIdDto) {
    //     const { ReviewId } = Param
    //     const Review = await this.ReviewRepository.findOneAndUpdate({ filter: { _id: ReviewId }, update: { isDeleted: true, deleteAt: new Date() } })
    //     if (!Review) {
    //         throw new BadRequestException("Review doasnot exist");
    //     }
    //     return { softDelete: true, Review }

    // }
    // async restoreSoftDeleteReview(Param: ReviewIdDto) {
    //     const { ReviewId } = Param
    //     const Review = await this.ReviewRepository.findOneAndUpdate({ filter: { _id: ReviewId, isDeleted: true, deleteAt: { $ne: null } }, update: { isDeleted: false, deleteAt: null } })
    //     if (!Review) {
    //         throw new BadRequestException("Review doasnot exist");
    //     }
    //     return { restore: true, Review }

    // }
    async deleteReview(Param: ReviewIdDto, user: hydartedUserDoc) {
        const { ReviewId } = Param;

        const review = await this.ReviewRepository.findOne({
            filter: { _id: ReviewId },
        });

        if (!review) {
            throw new BadRequestException("Review does not exist");
        }

        await this.ReviewRepository.Delete({
            _id: ReviewId,
        });

        const result = await this.ReviewRepository.aggregate([
            {
                $match: {
                    productId: review.productId,
                },
            },
            {
                $group: {
                    _id: "$productId",
                    avg_rate: { $avg: "$rate_number" },
                    rate_number: { $sum: 1 },
                },
            },
        ]);

        await this.productRepository.findOneAndUpdate({
            filter: { _id: review.productId },
            update: {
                avg_rate: result[0]?.avg_rate ?? 0,
                rate_number: result[0]?.rate_number ?? 0,
            },
        });

        return { message: "Review deleted successfully" };
    }




}
