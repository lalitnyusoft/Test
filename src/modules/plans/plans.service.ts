import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Plans } from 'src/models/plans.model';
import { PlansDto } from './dto/Plans.dto';
import { JwtUserDTO } from './../auth/dto/JwtUser.dto';

@Injectable()
export class PlansService {
    constructor(
        @InjectModel(Plans)
        private plansModel: typeof Plans,
    ) { }

    async createPlan(plansDto: PlansDto) {
        const plan = await this.plansModel.create({
            title: plansDto.title,
            slug: plansDto.slug,
            price: plansDto.price,
            description: plansDto.description,
        });
        return plan != null;
    }

    async getPlans() {
        const plans = await this.plansModel.findAll({
            where: { isActive: 1 },
            order: [['id', 'ASC']],
        })
        return plans;
    }
}
