import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { SubCategoryService } from './subCategory.service';
import { Roles, tokenTypeDecorator } from 'src/common/decorators/auth.decorator';
import { tokenEnum } from 'src/common/enum/token.enum';
import { RoleEnum } from 'src/common/enum/role.enum';
import { AuthGuard } from 'src/common/guards/authentecation.guard';
import { AuthrizationGuard } from 'src/common/guards/authorizaton.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { multer_enum, store_type_enum } from 'src/common/enum/multer.enum';
import { multerCloud } from 'src/common/middleware/multer.cloud';
import type { hydartedUserDoc } from 'src/DB/models/user.model';
import { User } from 'src/common/decorators/user.decorator';
import { SubCategoryIdDto, SubCategorysFilterDto, createSubCategoryDTO, updateSubCategoryDto } from '../subCategoryDto';

@Controller('sub-category')
export class subCategoryController {
    constructor(private readonly subcategoryService: SubCategoryService) { }

    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @UseInterceptors(FileInterceptor("logo", multerCloud({ custom_types: multer_enum.image, store_type: store_type_enum.disk })))
    @Post("create")
    createsubCategory(
        @UploadedFile(ParseFilePipe) logo: Express.Multer.File,
        @User() user: hydartedUserDoc,
        @Body() subCategoryData: createSubCategoryDTO
    ) {
        {
            return this.subcategoryService.createSubCategory(logo, user, subCategoryData);
        }

    }
    @tokenTypeDecorator(tokenEnum.accessToken)
    @Roles([RoleEnum.USER])
    @UseGuards(AuthGuard, AuthrizationGuard)
    @Patch("update/:subCategoryId")
    updatesubCategory(
        @Param() Params: SubCategoryIdDto,
        @User() user: hydartedUserDoc,
        @Body() subCategoryData: updateSubCategoryDto) {

        return this.subcategoryService.updateSubCategory(user, subCategoryData, Params.SubCategoryId);

    }
    @Get("")

    getsubCategorys(
        @Query() Query: SubCategorysFilterDto,
    ) {
        return this.subcategoryService.getSubCategorys(Query);
    }

    @Patch("soft-delete/:subCategoryId")
    softDeletesubCategory(@Param() Params: SubCategoryIdDto) {
        return this.subcategoryService.softDeleteSubCategory(Params)
    }
    @Patch("restore-soft-delete/:subCategoryId")
    restoreSoftDeletesubCategory(@Param() Params: SubCategoryIdDto) {
        return this.subcategoryService.restoreSoftDeleteSubCategory(Params)
    }
    @Delete("delete/:subCategoryId")
    DeletesubCategory(@Param() Params: SubCategoryIdDto) {
        return this.subcategoryService.deleteSubCategory(Params)
    }
}
