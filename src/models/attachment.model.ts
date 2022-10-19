import { AutoIncrement, Column, DataType, PrimaryKey, Table } from "sequelize-typescript";
import { BaseModel } from "./baseModel";

@Table({
    tableName: 'attachments',
    paranoid: true,
})
export class Attachment extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @Column
    attachableId: number;

    @Column({
        comment: 'post,comment,commentReply',
    })
    attachableType: string;

    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`],
        }),
        defaultValue: '1',
        comment: '1 for image, 2 for video',
    })
    attachmentType: number;

    @Column
    attachment: string;
}
