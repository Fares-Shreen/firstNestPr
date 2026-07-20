import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { hash } from "src/common/utils/security/hash.security";
import { RoleEnum } from "src/common/enum/role.enum";
import { slugify } from "node_modules/zod/v4/core/util.cjs";
import { User } from "./user.model";
import { Category } from "./category.model";
import { Brand } from "./brand.model";



@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class Product {
    @Prop({ type: String, required: true, min: 5, unique: true })
    name: string
    @Prop({
        type: String, default: function (this: Product) {
            return slugify(this.name)
        }
    })
    slug: string
    @Prop({ type: Types.ObjectId, ref: Category.name })
    categoryId: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: Brand.name })
    brandId: Types.ObjectId
    @Prop({ type: String, required: true })
    description: string
    @Prop({ type: Number, required: true })
    price: number
    @Prop({ type: [{ type: Types.ObjectId, ref: Product.name }] })
    boughtBy:Types.ObjectId[]
    @Prop({ type: Number, required: true, default: 0, optional: true, max: 100, min: 0 })
    discount: number
    @Prop({ type: Number, required: true })
    stock: Number
    @Prop({ type: Number })
    avg_rate: Number
    @Prop({ type: Number })
    rate_number: Number
    @Prop({ type: String, required: true })
    mainImage: string
    @Prop({ type: [String] })
    subImages: string[]
    @Prop({ type: Types.ObjectId, required: true, ref: User.name })
    createdBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId
    @Prop({ type: Date, default: null })
    deleteAt: Date
    @Prop({ type: Boolean, default: false })
    isDeleted: boolean
}

export const ProductSchema = SchemaFactory.createForClass(Product)

ProductSchema.pre(["findOneAndUpdate", "updateOne"], function () {
    console.log(this.getUpdate());
    const updated = this.getUpdate() as mongoose.UpdateQuery<Product>
    if (updated.name) {
        updated.slug = slugify(updated.name)
    }

})
// ProductSchema.pre(["findOneAndUpdate", "updateOne"], function () {
//     console.log(this)
// })

ProductSchema.pre(["find", "findOne"], function () {
    this.where({ isDeleted: false, deleteAt: null })
});


export type hydartedProductDoc = HydratedDocument<Product>
export const ProductModel = MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }])