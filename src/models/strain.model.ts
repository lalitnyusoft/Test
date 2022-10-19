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
@Table({
    tableName: 'strains',
    paranoid: true,
})
export class Strain extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    title: string;
}
