import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Op } from 'sequelize';
import { Category } from 'src/models/category.model';
import { Order } from 'src/models/order.model';

@Injectable()
export class CategoriesService {
    constructor(
        @InjectModel(Category)
        private categoryModel: typeof Category,
    ) { }

    async getAllCategories(){
        const categories = await this.categoryModel.findAll({
            where: { isActive: '1' }
        });
        return categories;
    }
}
