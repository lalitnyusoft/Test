import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    HasMany,
    ForeignKey,
    BelongsTo,
    DataType,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { User } from './user.model';
import { Category } from './category.model';
import { MedRec } from './medRec.model';
import { Strain } from './strain.model';
import { Ioro } from './ioro.model';
import { ProductImages } from './productImages.model';
import { ProductFavourite } from './productFavourite.model';
import { ProductPriceHistory } from './productPriceHistory.model';
import { Brand } from './brand.model';
import { Review } from './review.model';
import { Order } from './order.model';
const moment = require('moment');
require('dotenv').config();
const { CURRENCY } = process.env;

@Table({
    tableName: 'products',
    // paranoid: true,
})
export class Product extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @ForeignKey(() => Brand)
    @Column
    brandId: number;

    @Column
    title: string;

    @Column({
        unique: true,
    })
    slug: string;

    //@ForeignKey(() => Category)
    @Column
    categoryId: number;

    //@ForeignKey(() => MedRec)
    @Column
    medRecId: number;

    @Column({
        type: DataType.FLOAT(10, 2),
    })
    price: number;

    @Column({
        type: DataType.VIRTUAL
    })
    get productPrice(): string {
        return CURRENCY + (Math.round(this.getDataValue('price') * 100) / 100).toFixed(2)
    }

    //@ForeignKey(() => Strain)
    @Column
    strainId: number;

    @Column
    dominant: string;

    //@ForeignKey(() => Ioro)
    @Column
    iOId: number;

    @Column
    harvested: Date;

    @Column({
        type: DataType.VIRTUAL
    })
    get niceHarvested(): string {
        return moment(this.getDataValue('harvested')).format("DD MMM 'YY")
    }

    @Column({
        type: DataType.FLOAT(10, 2),
    })
    thc: number;

    @Column
    flavor: string;

    @Column({
        type: 'text',
    })
    description: string;

    @Column
    labResultsPath: string;

    @Column({
        defaultValue: 0,
        type: DataType.FLOAT(10, 2),
    })
    avgProductRating: number

    @Column({
        defaultValue: 0,
    })
    reviewsProductCount: number

    @BelongsTo(() => User, { foreignKey: 'userId', onDelete: 'cascade' })
    user: User;

    @BelongsTo(() => Brand, { foreignKey: 'brandId', onDelete: 'cascade' })
    brand: Brand;

    @BelongsTo(() => Category, 'categoryId')
    category: Category;

    @BelongsTo(() => MedRec, 'medRecId')
    medRec: MedRec;

    @BelongsTo(() => Strain, 'strainId')
    strain: Strain;

    @BelongsTo(() => Ioro, 'iOId')
    io: Ioro;

    @HasMany(() => ProductImages, { foreignKey: 'productId', onDelete: 'cascade' })
    productImages: ProductImages[];

    @HasMany(() => ProductFavourite, { foreignKey: 'productId', onDelete: 'cascade' })
    productFavourites: ProductFavourite[];

    @HasMany(() => ProductPriceHistory, { foreignKey: 'productId', onDelete: 'cascade' })
    productPriceHistory: ProductPriceHistory[];

    @HasMany(() => Review, { foreignKey: 'productId', onDelete: 'cascade' })
    productReviews: Review[];

    @HasMany(() => Order, { foreignKey: 'productId' })
    productOrder: Order[];
}
