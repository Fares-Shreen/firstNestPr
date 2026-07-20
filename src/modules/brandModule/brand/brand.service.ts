import { BadRequestException, ConflictException, Injectable, Query, Param } from '@nestjs/common';

import { BrandRepository } from 'src/DB/repositories/brand.repository';
import { brandIdDto, brandsFilterDto, createBrandDTO, updateBrandDto } from '../brandDTO';
import { hydartedUserDoc } from 'src/DB/models/user.model';
import { ExceptionsHandler } from '@nestjs/core/exceptions/exceptions-handler';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import { cloudinaryEventEmitter, SEND_CLOUDINARY_EVENT } from 'src/common/utils/cloudinary/cloudinary.event';
import { Types } from 'mongoose';

@Injectable()
export class BrandService {
    constructor(private readonly brandRepository: BrandRepository, private readonly cloudinaryTools: CloudinaryTools) { }

    async createBrand(file: Express.Multer.File, user: hydartedUserDoc, brandData: createBrandDTO) {
        const { name, slogan, categoryId } = brandData;
        if (await this.brandRepository.findOne({ filter: { name } })) {
            throw new ConflictException("Brand already exists");
        }
        if (!file) {
            throw new BadRequestException("Brand logo is required");
        }

        const logo = await this.cloudinaryTools.uploadFile({ filePath: file.path, folder: `brand-logos/${name}` });
        if (!logo) {
            throw new BadRequestException("Failed to upload brand logo");
        }
    
        const brand = await this.brandRepository.create({
            name,
            slogan,
            logo: logo.secure_url,
            createdBy: Types.ObjectId.createFromHexString(user.id as any) ,
            categoryId: Types.ObjectId.createFromHexString(categoryId as any)
        });
        if (!brand) {
            await this.cloudinaryTools.deleteFile(logo.public_id);
            throw new BadRequestException("Failed to create brand");
        }

        return brand;
    }

    async updateBrand(user: hydartedUserDoc, brandData: updateBrandDto, brandId: Types.ObjectId) {
        console.log(brandData)
        const { name, slogan } = brandData;
        const brand = await this.brandRepository.findOne({ filter: { _id: brandId } })
        if (!brand) {
            throw new BadRequestException("Brand doasnot exist");
        }
        if (name && brand.name == name) {
            throw new ConflictException("Brand already exist");
        }
        if (name && await this.brandRepository.findOne({ filter: { name: name } })) {
            throw new ConflictException("Brand already exist");
        }

        const updatedBrand = await this.brandRepository.findOneAndUpdate({
            filter: { _id: brandId }, update: {
                name: name ? name : undefined,
                slogan: slogan ? slogan : undefined,
                updatedBy: user.id
            }
        })

        return updatedBrand
    }

    async getBrands(Query: brandsFilterDto) {
        const { page, limit, search } = Query
        const brands = await this.brandRepository.pagination({
            page,
            limit,
            populate:[
                {
                    path:"product"
                }
            ],
            search: search ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { slogan: { $regex: search, $options: "i" } }
                ]
            } : {}
        });
        return brands;
    }
    async softDeleteBrand(Param: brandIdDto) {
        const { brandId } = Param
        const brand = await this.brandRepository.findOneAndUpdate({ filter: { _id: brandId } ,update:{isDeleted:true,deleteAt: new Date()}})
        if (!brand) {
            throw new BadRequestException("Brand doasnot exist");
        }
        return {softDelete:true,brand}

    }
    async restoreSoftDeleteBrand(Param: brandIdDto) {
        const { brandId } = Param
        const brand = await this.brandRepository.findOneAndUpdate({ filter: { _id: brandId , isDeleted: true ,deleteAt:{$ne:null} }, update: { isDeleted: false, deleteAt: null } })
        if (!brand) {
            throw new BadRequestException("Brand doasnot exist");
        }
        return { restore: true, brand }

    }
    async deleteBrand(Param: brandIdDto){
        const { brandId } = Param
        const brand = await this.brandRepository.findOne({ filter: { _id: brandId } })
        if (!brand) {
            throw new BadRequestException("Brand doasnot exist");
        }
        const deleteBrand = this.brandRepository.Delete({ filter: { _id: brandId }})
        return deleteBrand
    }




}
