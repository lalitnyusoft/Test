import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
    DataType,
    HasMany,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { Brand } from './brand.model';
import { ProductQuoteItem } from './productQuoteItem.model';
import { User } from './user.model';

@Table({
    tableName: 'product_quotes',
})
export class ProductQuote extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    quoteId: string;

    @ForeignKey(() => User)
    @Column
    retailerId: number;

    @ForeignKey(() => Brand)
    @Column
    brandId: number;

    @Column
    totalQuantity: number

    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`, `3`],
        }),
        comment: "1 for Requested, 2 for Quoted, 3 for Cancelled"
    })
    status: number

    @BelongsTo(() => User, 'retailerId')
    retailer: User;

    @BelongsTo(() => Brand, 'brandId')
    brand: Brand;

    @HasMany(() => ProductQuoteItem, { foreignKey: 'productQuoteId', onDelete: 'cascade' })
    productQuoteItems: ProductQuoteItem[];
}
