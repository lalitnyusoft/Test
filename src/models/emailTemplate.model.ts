import { EmailTemplateFooter } from './emailTemplateFooter.model';
import { EmailTemplateHeader } from './emailTemplateHeader.model';
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
    tableName: 'email_template',
    paranoid: true,
})
export class EmailTemplate extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => EmailTemplateHeader)
    @Column
    headerId: number;

    @ForeignKey(() => EmailTemplateFooter)
    @Column
    footerId: number;

    @Column
    title: string;

    @Column
    subject: string;

    @Column({
        type: DataType.TEXT
    })
    body: string;

    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`,],
        }),
        comment: '1 for active, 2 for inactive',
    })
    status: number

    @BelongsTo(() => EmailTemplateHeader, 'headerId')
    header: EmailTemplateHeader;

    @BelongsTo(() => EmailTemplateFooter, 'footerId')
    footer: EmailTemplateFooter;
} 
