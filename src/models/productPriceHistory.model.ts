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
import { Product } from './product.model';
@Table({
    tableName: 'product_price_history',
    paranoid: true,
})
export class ProductPriceHistory extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => Product)
    @Column
    productId: number;

    @Column({
        type: DataType.FLOAT(10, 2),
    })
    price: number;
    
    @BelongsTo(() => Product, 'productId')
    product: Product;
}
