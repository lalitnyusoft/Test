import {
    AutoIncrement,
    BelongsTo,
    Column,
    ForeignKey,
    PrimaryKey,
    Table,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { Product } from 'src/models/product.model';
@Table({
    tableName: 'product_images',
    paranoid: true,
})
export class ProductImages extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => Product)
    @Column
    productId: number;
    @BelongsTo(() => Product, 'productId')
    product: number;


    @Column
    image: string;

}
