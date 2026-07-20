import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { slugify } from "node_modules/zod/v4/core/util.cjs";
import { Brand } from "./brand.model";
import { User } from "./user.model";
import productRepository from "../repositories/product.repository";
import { Category } from "./category.model";


@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class SubCategory {
    @Prop({ type: String, required: true, min: 5, unique: true })
    name: string
    @Prop({ type: String, required: true })
    logo: string
    @Prop({ type: String })
    slogan: string
    @Prop({
        type: String, default: function (this: SubCategory) {
            return slugify(this.name)
        }
    })
    slug: string
    @Prop({ type: Types.ObjectId, ref: Category.name })
    categoryId: Types.ObjectId
    @Prop({ type: [{ type: Types.ObjectId, ref: 'Brand' }] })
    brands: Types.ObjectId[]
    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    createdBy: string
    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: string
    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: string
    @Prop({ type: Date, default: null })
    deleteAt: Date
    @Prop({ type: Boolean, default: false })
    isDeleted: boolean
}

export const SubcategorySchema = SchemaFactory.createForClass(SubCategory)
// SubcategorySchema.virtual("brand", {
//     ref: "Brand",
//     localField: "_id",
//     foreignField: "SubcategoryId"
// })

SubcategorySchema.pre(["findOneAndUpdate", "updateOne"], async function () {
    console.log(this.getUpdate());
    console
    const updated = this.getUpdate() as mongoose.UpdateQuery<SubCategory>
    if (updated.name) {
        updated.slug = slugify(updated.name)
    }
    
//     if (updated.isDeleted){
//         const Product = this.model.db.model('Product');
//         const Brand = this.model.db.model('Brand');
//         await Product.updateMany(
//             { SubcategoryId: this.getQuery()  },
//             {
//                 isDeleted: true,
//                 deleteAt: new Date(),
//             },
//         );
//         await Brand.updateMany(
//             { SubcategoryId: this.getQuery() },
//             {
//                 isDeleted: true,
//                 deleteAt: new Date(),
//             },
//         );
  
//     }
})
// SubCategorySchema.pre(["findOneAndUpdate", "updateOne"], function () {
//     console.log(this)
// })

SubcategorySchema.pre(["find", "findOne"], function () {
    this.where({ isDeleted: false, deleteAt: null })
});


export type hydartedSubCategoryDoc = HydratedDocument<SubCategory>
export const SubcategoryModel = MongooseModule.forFeature([{ name: SubCategory.name, schema: SubcategorySchema }])