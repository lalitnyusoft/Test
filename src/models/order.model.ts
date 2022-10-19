import { AutoIncrement, BelongsTo, Column, DataType, PrimaryKey, Table } from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { Brand } from './brand.model';
import { Category } from './category.model';
import { Product } from './product.model';
import { User } from './user.model';
require('dotenv').config();
const { CURRENCY } = process.env;
@Table({
    tableName: 'orders',
    paranoid: true,
})
export class Order extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    brandId: number;

    @Column
    retailerId: number;

    @Column
    orderId: string;

    @Column
    productId: number;

    @Column
    categoryId: number;

    @Column
    quantity: number;

    @Column({
        type: DataType.FLOAT(10, 2),
    })
    amount: number;

    @Column({
        type: DataType.VIRTUAL
    })
    get amountPrice(): string {
        return CURRENCY + (Math.round(this.getDataValue('amount') * 100) / 100).toFixed(2)
    }

    @Column({
        type: DataType.FLOAT(10, 2),
    })
    total: number;

    @Column
    cancelledBy: number;

    @Column
    cancelledAt: Date;

    @Column({
        type: DataType.VIRTUAL
    })
    get totalPrice(): string {
        return CURRENCY + (Math.round(this.getDataValue('total') * 100) / 100).toFixed(2)
    }

    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`, `3`,`4`,`5`, `6`],
        }),
        comment: "1 for Placed, 2 for Accepted, 3 for Cancelled, 4 for Delivered, 5 for Received, 6 for Completed"
    })
    status: number

    @BelongsTo(() => Brand, 'brandId')
    brand: Brand;

    @BelongsTo(() => User, 'retailerId')
    retailer: User;

    @BelongsTo(() => Product, 'productId')
    product: Product;

    @BelongsTo(() => Category, 'categoryId')
    category: Category;
}
