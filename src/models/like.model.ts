import { Op } from "sequelize";
import { AfterCreate, AfterDestroy, AfterRestore, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { BaseModel } from "./baseModel";
import { Post } from "./post.model";
import { User } from "./user.model";

@Table({
    tableName: 'likes',
    paranoid: true,
})
export class Like extends BaseModel {
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

    @BelongsTo(() => Post)
    posts: Post;

    @AfterCreate
    @AfterRestore
    static async incrementPostLikesCount(like: Like, options) {
        await Post.increment('likeCount', {
            where: {
                id: like.postId
            },
            transaction: options.transaction
        });
    }

    @AfterDestroy
    static async decrementPostLikesCount(like: Like) {
        await Post.decrement('likeCount', {
            where: {
                id: like.postId,
                likeCount: { [Op.gte]: 0 }
            },
        })
    }
}
