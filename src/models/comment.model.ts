import { Op } from "sequelize";
import { AfterCreate, AfterDestroy, AfterRestore, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Attachment } from "./attachment.model";
import { BaseModel } from "./baseModel";
import { CommentReply } from "./commentReply.model";
import { Post } from "./post.model";
import { User } from "./user.model";

@Table({
    tableName: 'comments',
    paranoid: true,
})
export class Comment extends BaseModel {
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
    post: Post;

    @Column({
        type: DataType.TEXT
    })
    comment: string;

    @HasMany(() => CommentReply, { foreignKey: 'commentId', })
    replies: CommentReply;

    @HasMany(() => Attachment,
        {
            foreignKey: 'attachableId',
            constraints: false,
            scope: {
                attachableType: 'comment'
            }
        }
    )
    attachments: Attachment;

    @Unique
    @Column
    commentUniqueId: string
    // @HasMany(() => CommentReply,
    //     {
    //         foreignKey: 'commentId',
    //         onDelete: 'cascade'
    //     }
    // )
    // replies: CommentReply;

    @Column({
        defaultValue: 0,
    })
    replyCount: number;

    @Column({
        defaultValue: 0,
    })
    likeCount: number;

    @AfterCreate
    @AfterRestore
    static async incrementPostCommentCount(comment: Comment, options) {
        await Post.increment('commentCount', {
            where: {
                id: comment.postId
            },
            transaction: options.transaction
        });
    }

    @AfterDestroy
    static async decrementPostCommentCount(comment: Comment) {
        await Post.decrement('commentCount', {
            where: {
                id: comment.postId,
                commentCount: { [Op.gte]: 0 }
            },
        })
    }
}
