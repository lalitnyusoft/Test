import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { CategoriesService } from './categories.service';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class CategoriesController {
    constructor(private readonly categoriesService: CategoriesService){}

    @Get()
    async getAllCategories(){
        const categories = await this.categoriesService.getAllCategories();
        return new ResponseSuccess('Categories',  categories );
    }
}
