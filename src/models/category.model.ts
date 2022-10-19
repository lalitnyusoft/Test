import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    HasMany,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { Order } from './order.model';
import { Product } from './product.model';
@Table({
    tableName: 'categories',
    paranoid: true,
})
export class Category extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    title: string;
}
