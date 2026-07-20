import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { Roles, tokenTypeDecorator } from 'src/common/decorators/auth.decorator';
import { tokenEnum } from 'src/common/enum/token.enum';
import { RoleEnum } from 'src/common/enum/role.enum';
import { AuthGuard } from 'src/common/guards/authentecation.guard';
import { AuthrizationGuard } from 'src/common/guards/authorizaton.guard';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express/multer';
import { multer_enum, store_type_enum } from 'src/common/enum/multer.enum';
import { multerCloud } from 'src/common/middleware/multer.cloud';
import type { hydartedUserDoc } from 'src/DB/models/user.model';
import { User } from 'src/common/decorators/user.decorator';
import { ProductIdDto, ProductsFilterDto, createProductDTO, updateProductDto } from '../productDto';
import { ProductService } from './product.service';

@Controller('Product')
export class ProductController {
    constructor(private readonly productService: ProductService) { }

    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @UseInterceptors(FileFieldsInterceptor([
        { name: "mainImage", maxCount: 1 },
        { name: "subImages", maxCount: 5 }
    ], multerCloud({ custom_types: multer_enum.image, store_type: store_type_enum.disk })))
    @Post("create")
    createProduct(
        @UploadedFiles() files: { mainImage?: Express.Multer.File[], subImages?: Express.Multer.File[] },
        @User() user: hydartedUserDoc,
        @Body() ProductData: createProductDTO
    ) {
        {
            return this.productService.createProduct(files, user, ProductData);
        }

    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Patch("update/:ProductId")
    updateProduct(
        @Param() Params: ProductIdDto,
        @User() user: hydartedUserDoc,
        @Body() ProductData: updateProductDto) {

        return this.productService.updateProduct(user, ProductData, Params.ProductId);

    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Get("")

    getProducts(
        @Query() Query: ProductsFilterDto,
    ) {
        return this.productService.getProducts(Query);
    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Patch("soft-delete/:ProductId")
    softDeleteProduct(@Param() Params: ProductIdDto) {
        return this.productService.softDeleteProduct(Params)
    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Patch("restore-soft-delete/:ProductId")
    restoreSoftDeleteProduct(@Param() Params: ProductIdDto) {
        return this.productService.restoreSoftDeleteProduct(Params)
    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Delete("delete/:ProductId")
    DeleteProduct(@Param() Params: ProductIdDto) {
        return this.productService.deleteProduct(Params)
    }
}
