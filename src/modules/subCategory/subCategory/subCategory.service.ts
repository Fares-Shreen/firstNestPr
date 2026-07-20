import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import SubCategoryRepository from 'src/DB/repositories/subCategory.repository';
import { SubCategoryIdDto, SubCategorysFilterDto, createSubCategoryDTO, updateSubCategoryDto } from '../subCategoryDto';
import { hydartedUserDoc } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { Types } from 'mongoose';

@Injectable()
export class SubCategoryService {
    constructor(private readonly subCategoryRepository: SubCategoryRepository, private readonly cloudinaryTools: CloudinaryTools, private readonly brandsRepository: BrandRepository) { }

    async createSubCategory(file: Express.Multer.File, user: hydartedUserDoc, SubCategoryData: createSubCategoryDTO) {
        const { name, brandsId, slogan } = SubCategoryData;
        if (await this.subCategoryRepository.findOne({ filter: { name } })) {
            throw new ConflictException("SubCategory already exists");
        }
        const uniqueBrandsId = [...new Set(brandsId || []) as any].map(id => Types.ObjectId.createFromHexString(id))
        if (uniqueBrandsId.length!=0){
            if (uniqueBrandsId.length != brandsId.length) {
                throw new BadRequestException("There duplicate in brands id ")
            }

            if (!brandsId && (await this.brandsRepository.find({ filter: { $in: { uniqueBrandsId } } })).length != uniqueBrandsId.length) {
                throw new BadRequestException("There is problem in brands id some ids not exist ")
            }
        }
        if (!file) {
            throw new BadRequestException("SubCategory logo is required");
        }

        const logo = await this.cloudinaryTools.uploadFile({ filePath: file.path, folder: `SubCategory-logos/${name}` });
        if (!logo) {
            throw new BadRequestException("Failed to upload SubCategory logo");
        }
        const SubCategory = await this.subCategoryRepository.create({
            name,
            logo: logo.secure_url,
            createdBy: user.id,
            brands: uniqueBrandsId,
            slogan: slogan ? slogan : undefined
        });
        if (!SubCategory) {
            await this.cloudinaryTools.deleteFile(logo.public_id);
            throw new BadRequestException("Failed to create SubCategory");
        }

        return SubCategory;
    }

    async updateSubCategory(user: hydartedUserDoc, SubCategoryData: updateSubCategoryDto, SubCategoryId: Types.ObjectId) {
        console.log(SubCategoryData)
        const { name, slogan } = SubCategoryData;
        const SubCategory = await this.subCategoryRepository.findOne({ filter: { _id: SubCategoryId } })
        if (!SubCategory) {
            throw new BadRequestException("SubCategory doasnot exist");
        }
        if (name && SubCategory.name == name) {
            throw new ConflictException("SubCategory already exist");
        }
        if (name && await this.subCategoryRepository.findOne({ filter: { name: name } })) {
            throw new ConflictException("SubCategory already exist");
        }

        const updatedSubCategory = await this.subCategoryRepository.findOneAndUpdate({
            filter: { _id: SubCategoryId }, update: {
                name: name ? name : undefined,
                slogan: slogan ? slogan : undefined,
                updatedBy: user.id
            }
        })

        return updatedSubCategory
    }

    async getSubCategorys(Query: SubCategorysFilterDto) {
        const { page, limit, search } = Query
        const SubCategorys = await this.subCategoryRepository.pagination({
            page,
            limit,
            // populate: [
            //     {
            //         path: "brand",
            //         populate: {
            //             path: "product"
            //         }
            //     }
            // ],
            search: search ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { slogan: { $regex: search, $options: "i" } }
                ]
            } : {}
        });
        return SubCategorys;
    }
    async softDeleteSubCategory(Param: SubCategoryIdDto) {
        const { SubCategoryId } = Param
        const SubCategory = await this.subCategoryRepository.findOneAndUpdate({ filter: { _id: SubCategoryId }, update: { isDeleted: true, deleteAt: new Date() } })

        if (!SubCategory) {
            throw new BadRequestException("SubCategory doasnot exist");
        }

        return { softDelete: true, SubCategory }

    }
    async restoreSoftDeleteSubCategory(Param: SubCategoryIdDto) {
        const { SubCategoryId } = Param
        const SubCategory = await this.subCategoryRepository.findOneAndUpdate({ filter: { _id: SubCategoryId, isDeleted: true, deleteAt: { $ne: null } }, update: { isDeleted: false, deleteAt: null } })
        if (!SubCategory) {
            throw new BadRequestException("SubCategory doasnot exist");
        }
        return { restore: true, SubCategory }

    }
    async deleteSubCategory(Param: SubCategoryIdDto) {
        const { SubCategoryId } = Param
        const SubCategory = await this.subCategoryRepository.findOne({ filter: { _id: SubCategoryId } })
        if (!SubCategory) {
            throw new BadRequestException("SubCategory doasnot exist");
        }
        const deleteSubCategory = this.subCategoryRepository.Delete({ filter: { _id: SubCategoryId } })
        return deleteSubCategory
    }


}
