import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    HasMany,
    ForeignKey,
    BelongsTo,
    DataType,
    AllowNull,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { User } from './user.model';
@Table({
    tableName: 'messages',
    paranoid: true,
})
export class Message extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    fromId: number;

    @ForeignKey(() => User)
    @Column
    toId: number;

    @Column({
        type: DataType.TEXT
    })
    message: string;

    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`,],
        }),
        comment: '1 for yes,2 for no',
    })
    attachment: number

    @AllowNull
    @Column
    fileType: string;

    @AllowNull
    @Column
    fileSize: string;

    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`,],
        }),
        comment: '1 for read, 2 for unread',
    })
    readStatus: number

    @BelongsTo(() => User, 'fromId')
    sender: User;

    @BelongsTo(() => User, 'toId')
    receiver: User;
} 
