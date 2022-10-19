import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Brand } from 'src/models/brand.model';
import { Category } from 'src/models/category.model';
import { Order } from 'src/models/order.model';
import { Product } from 'src/models/product.model';
import { Strain } from 'src/models/strain.model';
import { JwtUserDTO } from '../auth/dto/JwtUser.dto';
import { Sequelize } from 'sequelize';
import { Op } from 'sequelize';
const moment = require('moment');

@Injectable()
export class DashboardService {
    constructor(
        @InjectModel(Order)
        private order: typeof Order,
        @InjectModel(Brand)
        private brandModel: typeof Brand,
    ) { }

    async getOrdersData(jwtUserDTO: JwtUserDTO){
        const brand = await this.brandModel.findOne({
            where: {
                userId: jwtUserDTO.id
            }
        });
        if(!brand){
            throw new NotFoundException();
        }
        const ordersHistoryData = await this.order.findAll({
            include: [
                {
                    model: Product,
                    attributes: [
                        'title',
                        'price',
                        'productPrice'
                    ]
                },
                {
                    model: Category,
                    attributes: [
                        'title',
                    ]
                },
            ],
            attributes: {
                exclude: ['id', 'brandId', 'retailerId', 'productId', 'categoryId', 'cancelledBy', 'cancelledAt', 'updatedAt', 'deletedAt']
            },
            where: {
                    brandId: brand.id
            },
            order: [
                ['id', 'desc']
            ],
            limit: 5
        })
        return ordersHistoryData;
    }

    async getSoldByStrain(jwtUserDTO: JwtUserDTO, selectedMonth: string){
        const brand = await this.brandModel.findOne({
            where: {
                userId: jwtUserDTO.id
            }
        });
        if(!brand){
            throw new NotFoundException();
        }
        
        const startDate = moment(selectedMonth).startOf('month').add(1,"day").toDate();
        const endDate = moment(selectedMonth).endOf("month").toDate();
        
        const soldByStrainData = await this.order.findAll({
            include: [
                {
                    model: Product,
                    attributes: [
                        'id',
                        'strainId'
                    ],
                }
            ],
            attributes: [
                [
                    Sequelize.literal(`(
                        SELECT title
                        FROM strains
                        WHERE
                            strains.id = product.strainId
                    )`),
                    'strainTitle'
                ],
                [Sequelize.literal('sum(quantity)'), 'totalLbSold'],
            ],
            where: {
                brandId: brand.id,
                status: 6,
                updatedAt: {[Op.between]: [startDate , endDate ]}
            },
            order: [
                [Sequelize.literal('strainTitle'), 'asc'],
            ],
            group: ['product.strainId']
        })
        return soldByStrainData;
    }

    async getSoldByCategory(jwtUserDTO: JwtUserDTO, selectedMonth: string){
        const brand = await this.brandModel.findOne({
            where: {
                userId: jwtUserDTO.id
            }
        });
        if(!brand){
            throw new NotFoundException();
        }
        
        const startDate = moment(selectedMonth).startOf('month').add(1,"day").toDate();
        const endDate = moment(selectedMonth).endOf("month").toDate();
        
        const soldByStrainData = await this.order.findAll({
            include: [
                {
                    model: Product,
                    attributes: [
                        'id',
                        'categoryId'
                    ],
                }
            ],
            attributes: [
                [
                    Sequelize.literal(`(
                        SELECT title
                        FROM categories
                        WHERE
                        categories.id = product.categoryId
                    )`),
                    'categoryTitle'
                ],
                [Sequelize.literal('sum(quantity)'), 'totalLbSold'],
            ],
            where: {
                brandId: brand.id,
                status: 6,
                updatedAt: {[Op.between]: [startDate , endDate ]}
            },
            order: [
                [Sequelize.literal('categoryTitle'), 'asc'],
            ],
            group: ['product.categoryId']
        })
        return soldByStrainData;
    }
}
