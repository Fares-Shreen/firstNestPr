import { MongooseModule, Prop, Schema, SchemaFactory } from "@nestjs/mongoose";
import mongoose, { HydratedDocument, Types } from "mongoose";
import { hash } from "src/common/utils/security/hash.security";
import { RoleEnum } from "src/common/enum/role.enum";
import { slugify } from "node_modules/zod/v4/core/util.cjs";
import { User } from "./user.model";
import { Category } from "./category.model";



@Schema({
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    strictQuery: true
})
export class Brand {
    @Prop({ type: String, required: true, min: 5, unique: true })
    name: string
    @Prop({ type: String, required: true })
    logo: string
    @Prop({ type: String })
    slogan: string
    @Prop({
        type: String, default: function (this: Brand) {
            return slugify(this.name)
        }
    })
    slug: string
    @Prop({ type: Types.ObjectId, ref: Category.name })
    categoryId: Types.ObjectId
    @Prop({ type: Types.ObjectId, required: true, ref:User.name })
    createdBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: User.name })
    updatedBy: Types.ObjectId
    @Prop({ type: Types.ObjectId, ref: User.name })
    deletedBy: Types.ObjectId
    @Prop({ type: Date , default:null })
    deleteAt: Date
    @Prop({ type: Boolean ,default:false})
    isDeleted: boolean
}

export const BrandSchema = SchemaFactory.createForClass(Brand)

BrandSchema.pre(["findOneAndUpdate", "updateOne"], function () {
    console.log(this.getUpdate());
    console
    const updated = this.getUpdate() as mongoose.UpdateQuery<Brand>
    if (updated.name) {
        updated.slug = slugify(updated.name)
    }
})
// BrandSchema.pre(["findOneAndUpdate", "updateOne"], function () {
//     console.log(this)
// })

BrandSchema.pre(["find","findOne"], function () {
    this.where({ isDeleted: false, deleteAt:null })
});


export type hydartedBrandDoc = HydratedDocument<Brand>
export const BrandModel = MongooseModule.forFeature([{ name: Brand.name, schema: BrandSchema }])