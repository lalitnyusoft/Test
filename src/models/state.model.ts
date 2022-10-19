import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';

@Table({
    tableName: 'state',
    paranoid: true,
})
export class State extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    name: string
}
