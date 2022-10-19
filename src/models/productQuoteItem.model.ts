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
import { ProductQuote } from './productQuote.model';

@Table({
    tableName: 'product_quote_items',
    paranoid: true,
})
export class ProductQuoteItem extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => ProductQuote)
    @Column
    productQuoteId: number;

    @ForeignKey(() => Product)
    @Column
    productId: number;

    @Column
    quantity: number;
    
    @Column({
        type: DataType.FLOAT(10, 2)
    })
    price: number;

    @BelongsTo(() => ProductQuote, { foreignKey: 'productQuoteId', onDelete: 'cascade'})
    productQuote: ProductQuote;

    @BelongsTo(() => Product, { foreignKey: 'productId', onDelete: 'cascade'})
    product: Product;
}
