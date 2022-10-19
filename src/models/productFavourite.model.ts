import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { Product } from './product.model';
import { User } from './user.model';
@Table({
    tableName: 'product_favourite',
    paranoid: true,
})
export class ProductFavourite extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo( () => User, 'userId')
    user: User;

    @ForeignKey(() => Product)
    @Column
    productId: number;

    @BelongsTo( () => Product, 'productId')
    product: Product;
}
