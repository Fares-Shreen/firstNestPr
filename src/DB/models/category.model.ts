import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { slugify } from "node_modules/zod/v4/core/util.cjs";
import { Brand } from "./brand.model";
import { User } from "./user.model";
import productRepository from "../repositories/product.repository";


@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class Category {
    @Prop({ type: String, required: true, min: 5, unique: true })
    name: string
    @Prop({ type: String, required: true })
    logo: string
    @Prop({ type: String })
    slogan: string
    @Prop({
        type: String, default: function (this: Category) {
            return slugify(this.name)
        }
    })
    slug: string
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

export const categorySchema = SchemaFactory.createForClass(Category)
categorySchema.virtual("brand", {
    ref: "Brand",
    localField: "_id",
    foreignField: "categoryId"
})

categorySchema.pre(["findOneAndUpdate", "updateOne"], async function () {
    console.log(this.getUpdate());
    console
    const updated = this.getUpdate() as mongoose.UpdateQuery<Category>
    if (updated.name) {
        updated.slug = slugify(updated.name)
    }
    
//     if (updated.isDeleted){
//         const Product = this.model.db.model('Product');
//         const Brand = this.model.db.model('Brand');
//         await Product.updateMany(
//             { categoryId: this.getQuery()  },
//             {
//                 isDeleted: true,
//                 deleteAt: new Date(),
//             },
//         );
//         await Brand.updateMany(
//             { categoryId: this.getQuery() },
//             {
//                 isDeleted: true,
//                 deleteAt: new Date(),
//             },
//         );
  
//     }
})
// CategorySchema.pre(["findOneAndUpdate", "updateOne"], function () {
//     console.log(this)
// })

categorySchema.pre(["find", "findOne"], function () {
    this.where({ isDeleted: false, deleteAt: null })
});


export type hydartedCategoryDoc = HydratedDocument<Category>
export const categoryModel = MongooseModule.forFeature([{ name: Category.name, schema: categorySchema }])