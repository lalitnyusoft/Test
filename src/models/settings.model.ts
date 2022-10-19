import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
@Table({
    tableName: 'settings',
    paranoid: true,
})
export class Settings extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    name: string;

    @Column
    description: string;
}
