import { IsOptional } from 'class-validator';
import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    HasMany,
    ForeignKey,
    BelongsTo,
    DataType,
    AllowNull,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { Order } from './order.model';
import { Product } from './product.model';
import { Review } from './review.model';
import { User } from './user.model';
@Table({
    tableName: 'brand_details',
    // paranoid: true,
})
export class Brand extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @Column
    brandName: string;

    @Column
    slug: string;

    @AllowNull
    @Column
    website: string;

    @AllowNull
    @Column
    year: string;

    @AllowNull
    @Column({
        defaultValue: 0,
        type: DataType.FLOAT(10, 2),
    })
    avgOrder: number;

    @AllowNull
    @Column
    address: string;

    @AllowNull
    @Column({
        type: DataType.TEXT
    })
    description: string;

    @AllowNull
    @Column({
        defaultValue: 0,
        type: DataType.FLOAT(10, 2),
    })
    avgProductRating: number;

    @AllowNull
    @Column({
        defaultValue: 0,
    })
    reviewsProductCount: number;

    @AllowNull
    @Column({
        defaultValue: 0,
        type: DataType.FLOAT(10, 2),
    })
    avgDOTRating: number;

    @AllowNull
    @Column({
        defaultValue: 0,
    })
    reviewsDOTCount: number;

    @AllowNull
    @Column({
        defaultValue: 0,
        type: DataType.FLOAT(10, 2),
    })
    avgGeneralRating: number;

    @AllowNull
    @Column({
        defaultValue: 0,
    })
    reviewsGeneralCount: string;

    @AllowNull
    @Column({
        defaultValue: 0,
        type: DataType.FLOAT(10, 2),
    })
    avgRating: number;

    @BelongsTo(() => User, 'userId')
    user: User;

    @HasMany(() => Review, {onDelete: 'cascade'})
    reviews: Review;
    
    @HasMany(() => Order, {foreignKey: 'brandId', onDelete: 'cascade'})
    orders: Order;

    @HasMany(() => Product, {foreignKey: 'brandId', onDelete: 'cascade'})
    product: Product;
}
