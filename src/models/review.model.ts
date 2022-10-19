import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
    DataType,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { Brand } from './brand.model';
import { Product } from './product.model';
import { User } from './user.model';
@Table({
    tableName: 'reviews',
    paranoid: true,
})
export class Review extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => Product)
    @Column
    productId: number;

    @BelongsTo(() => Product, 'productId')
    product: Product;

    @ForeignKey(() => Brand)
    @Column
    brandId: number;

    @BelongsTo(() => Brand, 'brandId')
    brand: Brand;

    @ForeignKey(() => User)
    @Column
    retailerId: number;

    @BelongsTo(() => User, 'retailerId')
    retailer: User;

    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`, `3`],
        }), 
        comment: '1 for product, 2 for delivery on time, 3 for general',
    })
    type: number

    @Column({
        type: DataType.FLOAT(10, 2),
    })
    ratings: number;

    @Column({
        type: DataType.TEXT
    })
    description: string;
}
