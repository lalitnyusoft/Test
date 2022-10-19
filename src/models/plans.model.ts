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
require('dotenv').config();
const { CURRENCY } = process.env;
@Table({
    tableName: 'plans',
    paranoid: true,
})
export class Plans extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    title: string;

    @Column
    slug: string;

    @Column({
        type: DataType.FLOAT(10, 2),
    })
    price: number;

    @Column({
        type: DataType.VIRTUAL
    })
    get planPrice(): string {
        return CURRENCY + (Math.round(this.getDataValue('price') * 100) / 100).toFixed(2)
    }

    @Column
    description: string;
}
