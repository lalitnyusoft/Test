import { AutoIncrement, BelongsTo, Column, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { BaseModel } from "./baseModel";
import { Post } from "./post.model";
import { User } from "./user.model";

@Table({
    tableName: 'reposts',
    paranoid: true,
})
export class Repost extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Post)
    @Column
    postId: number;

    @BelongsTo(() => Post, { foreignKey: 'postId' })
    posts: Post;

    @Column
    repostId: number;

    // @BelongsTo(() => Post, { foreignKey: 'repostId' })
    // repost: Post;
}
