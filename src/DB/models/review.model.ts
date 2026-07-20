import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { hash } from "src/common/utils/security/hash.security";
import { RoleEnum } from "src/common/enum/role.enum";
import { slugify } from "node_modules/zod/v4/core/util.cjs";
import { User } from "./user.model";
import { Category } from "./category.model";
import { Brand } from "./brand.model";
import { Product, ProductSchema } from "./product.model";



@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class Review {
    @Prop({ type: String, required: true })
    contentReview: string
    @Prop({type:Types.ObjectId,ref:Product.name})
    productId:Types.ObjectId
    @Prop({ type: Number ,min:1,max:5 })
    rate_number: Number
    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    createdBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId
}

export const ReviewSchema = SchemaFactory.createForClass(Review)

ReviewSchema.pre(["findOneAndUpdate", "updateOne"], function () {
    console.log(this.getUpdate());
    const updated = this.getUpdate() as mongoose.UpdateQuery<Review>
    if (updated.name) {
        updated.slug = slugify(updated.name)
    }
    
})

// export async function updateProductRating(productId: Types.ObjectId) {
//     const Review = mongoose.model("Review");
//     const Product = mongoose.model("Product");

//     const result = await Review.aggregate([
//         {
//             $match: { productId }
//         },
//         {
//             $group: {
//                 _id: "$productId",
//                 avg_rate: { $avg: "$rate_number" },
//                 rate_number: { $sum: 1 }
//             }
//         }
//     ]);

//     await Product.findByIdAndUpdate(productId, {
//         avg_rate: result[0]?.avg_rate ?? 0,
//         rate_number: result[0]?.rate_number ?? 0,
//     });
// }

// ReviewSchema.post("save",function(){
//     const ll=ReviewSchema.post("save", async function (doc) {
//         await updateProductRating(doc.productId);
//     });
//     console.log(ll);
    
// })
// ReviewSchema.pre(["findOneAndUpdate", "updateOne"], function () {
//     console.log(this)
// })

// ReviewSchema.pre(["find", "findOne"], function () {
//     this.where({ isDeleted: false, deleteAt: null })
// });



export type hydartedReviewDoc = HydratedDocument<Review>
export const ReviewModel = MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }])