import { User } from 'src/models/user.model';
import { AfterCreate, AfterDestroy, AfterRestore, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, PrimaryKey, Table } from "sequelize-typescript";
import { BaseModel } from "./baseModel";
import { Comment } from "./comment.model";
import { Attachment } from './attachment.model';

@Table({
    tableName: 'comment_replies',
    paranoid: true,
})
export class CommentReply extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => Comment)
    @Column
    commentId: number;
    @BelongsTo(() => Comment)
    comments: Comment;
    // @BelongsTo(() => Comment, { onDelete: "cascade", foreignKey: "commentId" })
    // comment: Comment;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User)
    user: User;

    @Column
    reply: string;

    @HasMany(() => Attachment,
        {
            foreignKey: 'attachableId',
            constraints: false,
            scope: {
                attachableType: 'commentReply'
            }
        }
    )
    attachments: Attachment;

    @AfterCreate
    static async incrementCommentReplyCount(commentReply: CommentReply, options) {
        await Comment.increment('replyCount', {
            where: {
                id: commentReply.commentId
            },
            transaction: options.transaction
        });
    }

    @AfterDestroy
    static async decrementCommentReplyCount(commentReply: CommentReply) {
        await Comment.decrement('replyCount', {
            where: {
                id: commentReply.commentId
            },
        })
    }
}
