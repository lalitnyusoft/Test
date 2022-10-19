import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    DataType,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
@Table({
    tableName: 'axis_point',
    paranoid: true,
})
export class AxisPoint extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column({
        defaultValue: 0,
        // type: DataType.BLOB('long'),
        type: DataType.BLOB,
    })
    file: string;
}
