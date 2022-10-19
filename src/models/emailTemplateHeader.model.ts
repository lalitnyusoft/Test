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
    tableName: 'email_template_header',
    paranoid: true,
})
export class EmailTemplateHeader extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    title: string;

    @Column({
        type: DataType.TEXT
    })
    description: string;

    @Column
    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`,],
        }),
        comment: '1 for active, 2 for inactive',
    })
    status: number
}
