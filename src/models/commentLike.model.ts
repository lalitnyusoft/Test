import { AfterCreate, AfterDestroy, AfterRestore, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, PrimaryKey, Table } from "sequelize-typescript";
import { BaseModel } from "./baseModel";
import { Comment } from "./comment.model";
import { User } from "./user.model";

@Table({
    tableName: 'comment_like',
    paranoid: true,
})
export class CommentLike extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @ForeignKey(() => Comment)
    @Column
    commentId: number;

    @BelongsTo(() => Comment)
    comment: Comment;

    @AfterCreate
    @AfterRestore
    static async incrementCommentLikesCount(commentLike: CommentLike, options) {
        await Comment.increment('likeCount', {
            where: {
                id: commentLike.commentId
            },
            transaction: options.transaction
        });
    }

    @AfterDestroy
    static async decrementCommentLikesCount(commentLike: CommentLike) {
        await Comment.decrement('likeCount', {
            where: {
                id: commentLike.commentId
            },
        })
    }
}
