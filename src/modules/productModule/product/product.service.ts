import { BadRequestException, ConflictException, Injectable } from '@nestjs/common';
import { CloudinaryTools } from 'src/common/utils/cloudinary/clodinary.tools';
import ProductRepository from 'src/DB/repositories/product.repository';
import { ProductIdDto, ProductsFilterDto, createProductDTO, updateProductDto } from '../productDto';
import { hydartedUserDoc } from 'src/DB/models/user.model';
import BrandRepository from 'src/DB/repositories/brand.repository';
import { Types } from 'mongoose';
import CategoryRepository from 'src/DB/repositories/category.repository';

@Injectable()
export class ProductService {
    constructor(private readonly ProductRepository: ProductRepository, private readonly cloudinaryTools: CloudinaryTools, private readonly brandsRepository: BrandRepository, private readonly categoryRepository: CategoryRepository) { }

    async createProduct(files: { mainImage?: Express.Multer.File[], subImages?: Express.Multer.File[] }, user: hydartedUserDoc, ProductData: createProductDTO) {
        let { name, brandId, categoryId, description, price, discount, stock } = ProductData;
        console.log(files)
        if (await this.categoryRepository.findOne({ filter: { _id: categoryId } })) {
            throw new BadRequestException("Category doasnot exist");
        }
        if (await this.brandsRepository.findOne({ filter: { _id: brandId } })) {
            throw new BadRequestException("Brand doasnot exist");
        }
        if (await this.ProductRepository.findOne({ filter: { name } })) {
            throw new ConflictException("Product already exists");
        }

        if (!brandId) {
            throw new BadRequestException("There is problem in brands id some ids not exist ")
        }
        if (!files || !files.mainImage || files.mainImage.length === 0) {
            throw new BadRequestException("Product image is required");
        }

        const mainImageFile = files.mainImage[0];
        const mainImage = await this.cloudinaryTools.uploadFile({ filePath: mainImageFile.path, folder: `Product-mainImages/${name}` });
        if (!mainImage) {
            throw new BadRequestException("Failed to upload Product mainImage");
        }
        let subImages: { public_id: string; secure_url: string; }[] = [];
        if (files.subImages && files.subImages.length > 0) {
            subImages = (await this.cloudinaryTools.uploadFiles({ files: files.subImages as any, folder: `Product-subImages/${name}` }))!;
        }
        if (price && discount) {
            price = price - (price * discount / 100);
        }
        const Product = await this.ProductRepository.create({
            name,
            mainImage: mainImage.secure_url,
            createdBy: Types.ObjectId.createFromHexString(user.id as any),
            brandId: Types.ObjectId.createFromHexString(brandId as any),
            categoryId: Types.ObjectId.createFromHexString(categoryId as any),
            description,
            price,
            discount,
            stock,
            subImages: subImages ? subImages.map((image) => image.secure_url) : [],


        });
        if (!Product) {
            await this.cloudinaryTools.deleteFile(mainImage.public_id);
            throw new BadRequestException("Failed to create Product");
        }

        return Product;
    }

    async updateProduct(user: hydartedUserDoc, ProductData: updateProductDto, ProductId: Types.ObjectId) {
        console.log(ProductData)
        let { name, price, description, discount, stock, categoryId, brandId } = ProductData;
        const Product = await this.ProductRepository.findOne({ filter: { _id: ProductId } })
        if (!Product) {
            throw new BadRequestException("Product doasnot exist");
        }
        if (name && Product.name == name) {
            throw new ConflictException("Product already exist");
        }
        if (name && await this.ProductRepository.findOne({ filter: { name: name } })) {
            throw new ConflictException("Product already exist");
        }
        const updatedFields = {
            updatedBy: user.id,
        }
        if (price && discount) {
            price = price - (price * discount / 100);
        }
        else if (price) {
            price = price - (price * Product.discount / 100);
        }
        else if (discount) {
            price = Product.price - (Product.price * discount / 100);
        }

        if (name) {
            updatedFields['name'] = name;
        }
        if (price) {
            updatedFields['price'] = price;
        }
        if (description) {
            updatedFields['description'] = description;
        }
        if (discount) {
            updatedFields['discount'] = discount;
        }
        if (stock) {
            updatedFields['stock'] = stock;
        }
        if (categoryId) {
            if (await this.categoryRepository.findOne({ filter: { _id: categoryId } })) {
                throw new BadRequestException("Category doasnot exist");
            }

            updatedFields['categoryId'] = categoryId;
        }
        if (brandId) {
            if (await this.brandsRepository.findOne({ filter: { _id: brandId } })) {
                throw new BadRequestException("Brand doasnot exist");
            }
            updatedFields['brandId'] = brandId;
        }


        const updatedProduct = await this.ProductRepository.findOneAndUpdate({
            filter: { _id: ProductId }, update: updatedFields, options: { new: true }
        })

        return updatedProduct
    }

    async getProducts(Query: ProductsFilterDto) {
        const { page, limit, search } = Query
        const Products = await this.ProductRepository.pagination({
            page,
            limit,
            populate: [
                {
                    path: "brand"
                }
            ],
            search: search ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { slogan: { $regex: search, $options: "i" } }
                ]
            } : {}
        });
        return Products;
    }
    async softDeleteProduct(Param: ProductIdDto) {
        const { ProductId } = Param
        const Product = await this.ProductRepository.findOneAndUpdate({ filter: { _id: ProductId }, update: { isDeleted: true, deleteAt: new Date() } })
        if (!Product) {
            throw new BadRequestException("Product doasnot exist");
        }
        return { softDelete: true, Product }

    }
    async restoreSoftDeleteProduct(Param: ProductIdDto) {
        const { ProductId } = Param
        const Product = await this.ProductRepository.findOneAndUpdate({ filter: { _id: ProductId, isDeleted: true, deleteAt: { $ne: null } }, update: { isDeleted: false, deleteAt: null } })
        if (!Product) {
            throw new BadRequestException("Product doasnot exist");
        }
        return { restore: true, Product }

    }
    async deleteProduct(Param: ProductIdDto) {
        const { ProductId } = Param
        const Product = await this.ProductRepository.findOne({ filter: { _id: ProductId } })
        if (!Product) {
            throw new BadRequestException("Product doasnot exist");
        }
        const deleteProduct = this.ProductRepository.Delete({ filter: { _id: ProductId } })
        return deleteProduct
    }


}
