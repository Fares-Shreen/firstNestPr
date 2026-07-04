import { Body, Controller, Delete, Get, Param, ParseFilePipe, Patch, Post, Query, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { CategoryService } from './category.service';
import { Roles, tokenTypeDecorator } from 'src/common/decorators/auth.decorator';
import { tokenEnum } from 'src/common/enum/token.enum';
import { RoleEnum } from 'src/common/enum/role.enum';
import { AuthGuard } from 'src/common/guards/authentecation.guard';
import { AuthrizationGuard } from 'src/common/guards/authorizaton.guard';
import { FileInterceptor } from '@nestjs/platform-express/multer';
import { multer_enum, store_type_enum } from 'src/common/enum/multer.enum';
import { multerCloud } from 'src/common/middleware/multer.cloud';
import type{ hydartedUserDoc } from 'src/DB/models/user.model';
import { User } from 'src/common/decorators/user.decorator';
import { CategoryIdDto, CategorysFilterDto, createCategoryDTO, updateCategoryDto } from '../categoryDto';

@Controller('category')
export class CategoryController {
        constructor(private readonly categoryService: CategoryService) { }
    
        @tokenTypeDecorator(tokenEnum.accessToken)
        @Roles([RoleEnum.USER])
        @UseGuards(AuthGuard, AuthrizationGuard)
        @UseInterceptors(FileInterceptor("logo", multerCloud({ custom_types: multer_enum.image, store_type: store_type_enum.disk })))
        @Post("create")
        createCategory(
            @UploadedFile(ParseFilePipe) logo: Express.Multer.File,
            @User() user: hydartedUserDoc,
            @Body() CategoryData: createCategoryDTO
        ) {
            {
                return this.categoryService.createCategory(logo, user, CategoryData);
            }
    
        }
        @tokenTypeDecorator(tokenEnum.accessToken)
        @Roles([RoleEnum.USER])
        @UseGuards(AuthGuard, AuthrizationGuard)
        @Patch("update/:CategoryId")
        updateCategory(
            @Param() Params: CategoryIdDto,
            @User() user: hydartedUserDoc,
            @Body() CategoryData: updateCategoryDto) {
                
            return this.categoryService.updateCategory(user, CategoryData, Params.CategoryId);
    
        }
        @Get("")
    
        getCategorys(
            @Query() Query: CategorysFilterDto,
            ) {
            return this.categoryService.getCategorys(Query);
        }
    
        @Patch("soft-delete/:CategoryId")
        softDeleteCategory(@Param() Params:CategoryIdDto){
            return this.categoryService.softDeleteCategory(Params)
        }
        @Patch("restore-soft-delete/:CategoryId")
        restoreSoftDeleteCategory(@Param() Params: CategoryIdDto) {
            return this.categoryService.restoreSoftDeleteCategory(Params)
        }
        @Delete("delete/:CategoryId")
        DeleteCategory(@Param() Params: CategoryIdDto){
            return this.categoryService.deleteCategory(Params)
        }
}
