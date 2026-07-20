import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import CategoryRepository from 'src/DB/repositories/category.repository';
import { CategoryIdDto, CategorysFilterDto, createCategoryDTO, updateCategoryDto } from '../categoryDto';
import { hydartedUserDoc } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { Types } from 'mongoose';

@Injectable()
export class CategoryService {
    constructor(private readonly CategoryRepository: CategoryRepository, private readonly cloudinaryTools: CloudinaryTools, private readonly brandsRepository: BrandRepository) { }
    
        async createCategory(file: Express.Multer.File, user: hydartedUserDoc, CategoryData: createCategoryDTO) {
            const { name , brandsId , slogan} = CategoryData;
            if (await this.CategoryRepository.findOne({ filter: { name } })) {
                throw new ConflictException("Category already exists");
            }
            const uniqueBrandsId = [...new Set(brandsId ||[]) as any].map(id => Types.ObjectId.createFromHexString(id))
            if (uniqueBrandsId.length != brandsId.length) {
                throw new BadRequestException("There duplicate in brands id ")
            }
            
            if (!brandsId && (await this.brandsRepository.find({ filter: { $in: { uniqueBrandsId }}})).length != uniqueBrandsId.length) {
                throw new BadRequestException("There is problem in brands id some ids not exist ")
            }
            if (!file) {
                throw new BadRequestException("Category logo is required");
            }
    
            const logo = await this.cloudinaryTools.uploadFile({ filePath: file.path, folder: `Category-logos/${name}` });
            if (!logo) {
                throw new BadRequestException("Failed to upload Category logo");
            }
            const Category = await this.CategoryRepository.create({
                name,
                logo: logo.secure_url,
                createdBy: user._id,
                brands:uniqueBrandsId,
                slogan:slogan?slogan :undefined
            });
            if (!Category) {
                await this.cloudinaryTools.deleteFile(logo.public_id);
                throw new BadRequestException("Failed to create Category");
            }
    
            return Category;
        }
    
        async updateCategory(user: hydartedUserDoc, CategoryData: updateCategoryDto, CategoryId: Types.ObjectId) {
            console.log(CategoryData)
            const { name, slogan } = CategoryData;
            const Category = await this.CategoryRepository.findOne({ filter: { _id: CategoryId } })
            if (!Category) {
                throw new BadRequestException("Category doasnot exist");
            }
            if (name && Category.name == name) {
                throw new ConflictException("Category already exist");
            }
            if (name && await this.CategoryRepository.findOne({ filter: { name: name } })) {
                throw new ConflictException("Category already exist");
            }
    
            const updatedCategory = await this.CategoryRepository.findOneAndUpdate({
                filter: { _id: CategoryId }, update: {
                    name: name ? name : undefined,
                    slogan: slogan ? slogan : undefined,
                    updatedBy: user.id
                }
            })
    
            return updatedCategory
        }
    
        async getCategorys(Query: CategorysFilterDto) {
            const { page, limit, search } = Query
            const Categorys = await this.CategoryRepository.pagination({
                page,
                limit,
                populate:[
                    {
                        path:"brand",
                        populate:
                        {
                            path: "product"
                        }
                    },

                 ],
                search: search ? {
                    $or: [
                        { name: { $regex: search, $options: "i" } },
                        { slogan: { $regex: search, $options: "i" } }
                    ]
                } : {}
            });
            return Categorys;
        }
        async softDeleteCategory(Param: CategoryIdDto) {
            const { CategoryId } = Param
            const Category = await this.CategoryRepository.findOneAndUpdate({ filter: { _id: CategoryId } ,update:{isDeleted:true,deleteAt: new Date()}})

            if (!Category) {
                throw new BadRequestException("Category doasnot exist");
            }
            
            return {softDelete:true,Category}
    
        }
        async restoreSoftDeleteCategory(Param: CategoryIdDto) {
            const { CategoryId } = Param
            const Category = await this.CategoryRepository.findOneAndUpdate({ filter: { _id: CategoryId , isDeleted: true ,deleteAt:{$ne:null} }, update: { isDeleted: false, deleteAt: null } })
            if (!Category) {
                throw new BadRequestException("Category doasnot exist");
            }
            return { restore: true, Category }
    
        }
        async deleteCategory(Param: CategoryIdDto){
            const { CategoryId } = Param
            const Category = await this.CategoryRepository.findOne({ filter: { _id: CategoryId } })
            if (!Category) {
                throw new BadRequestException("Category doasnot exist");
            }
            const deleteCategory = this.CategoryRepository.Delete({ filter: { _id: CategoryId }})
            return deleteCategory
        }
    
    
}
