import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors, UsePipes, ValidationPipe } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { Roles, tokenTypeDecorator } from 'src/common/decorators/auth.decorator';
import { User } from 'src/common/decorators/user.decorator';
import { multer_enum, store_type_enum } from 'src/common/enum/multer.enum';
import { RoleEnum } from 'src/common/enum/role.enum';
import { tokenEnum } from 'src/common/enum/token.enum';
import { AuthGuard } from 'src/common/guards/authentecation.guard';
import { AuthrizationGuard } from 'src/common/guards/authorizaton.guard';
import { multerCloud } from 'src/common/middleware/multer.cloud';
import type { hydartedUserDoc } from 'src/DB/models/user.model';
import { brandIdDto, brandsFilterDto, createBrandDTO, updateBrandDto } from '../brandDTO';
import { BrandService } from './brand.service';

@Controller('brand')
@UsePipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true
}))
export class BrandController {
    constructor(private readonly brandService: BrandService) { }

    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @UseInterceptors(FileInterceptor("file", multerCloud({ custom_types: multer_enum.image, store_type: store_type_enum.disk })))
    @Post("create-brand")
    createBrand(
        @UploadedFile(ParseFilePipe) file: Express.Multer.File,
        @User() user: hydartedUserDoc,
        @Body() brandData: createBrandDTO
    ) {
        {
            return this.brandService.createBrand(file, user, brandData);
        }

    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Patch("update/:brandId")
    updateBrand(
        @Param() Params: brandIdDto,
        @User() user: hydartedUserDoc,
        @Body() brandData: updateBrandDto) {
            
        return this.brandService.updateBrand(user, brandData, Params.brandId);

    }
    // @tokenTypeDecorator(tokenEnum.accessToken)
    // @Roles([RoleEnum.USER])
    // @UseGuards(AuthGuard, AuthrizationGuard)`
    @Get("")

    getBrands(
        @Query() Query: brandsFilterDto,
        ) {
        return this.brandService.getBrands(Query);
    }

    @Patch("soft-delete/:brandId")
    softDeleteBrand(@Param() Params:brandIdDto){
        return this.brandService.softDeleteBrand(Params)
    }
    @Patch("restore-soft-delete/:brandId")
    restoreSoftDeleteBrand(@Param() Params: brandIdDto) {
        return this.brandService.restoreSoftDeleteBrand(Params)
    }
    @Delete("delete/:brandId")
    DeleteBrand(@Param() Params: brandIdDto){
        return this.brandService.deleteBrand(Params)
    }

    
}
