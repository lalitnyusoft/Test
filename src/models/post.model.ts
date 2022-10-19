import { Op } from "sequelize";
import { AfterBulkDestroy, AfterCreate, AfterDestroy, AfterRestore, AutoIncrement, BelongsTo, Column, DataType, ForeignKey, HasMany, PrimaryKey, Table, Unique } from "sequelize-typescript";
import { Attachment } from "./attachment.model";
import { BaseModel } from "./baseModel";
import { Comment } from "./comment.model";
import { Follower } from "./follower.model";
import { Like } from "./like.model";
import { Repost } from "./repost.model";
import { User } from "./user.model";

@Table({
    tableName: 'posts',
    paranoid: true,
})
export class Post extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    userId: number;

    @BelongsTo(() => User, { onDelete: "cascade", foreignKey: "userId" })
    user: User;

    @HasMany(() => Follower, { sourceKey: "userId", foreignKey: "followerId" })
    userFollowers: Follower;

    @Column({
        type: DataType.ENUM({
            values: [`1`, `2`],
        }),
        defaultValue: '1',
        comment: '1 for post, 2 for repost',
    })
    type: number;

    @ForeignKey(() => Post)
    @Column
    repostId: number;

    @BelongsTo(() => Post, { onDelete: "cascade", foreignKey: "repostId" })
    parentPost: Post;

    @Column({
        type: DataType.TEXT
    })
    post: string;
    comment: 'post-text/message'

    @Unique
    @Column
    postUniqueId: string;

    @HasMany(() => Attachment,
        {
            foreignKey: 'attachableId',
            constraints: false,
            scope: {
                attachableType: 'post'
            }
        }
    )
    attachments: Attachment;

    @HasMany(() => Repost,
        {
            foreignKey: 'repostId',
            onDelete: 'cascade',
            hooks: true,
        }
    )
    reposts: Repost;

    @HasMany(() => Comment,
        {
            foreignKey: 'postId',
            onDelete: 'cascade'
        }
    )
    comments: Comment;

    @HasMany(() => Like,
        {
            foreignKey: 'postId',
            onDelete: 'cascade'
        }
    )
    likes: Like;

    @Column({
        defaultValue: 0,
        allowNull: false,
    })
    likeCount: number;

    @Column({
        defaultValue: 0,
        allowNull: false,
    })
    repostCount: number;

    @Column({
        defaultValue: 0,
        allowNull: false,
    })
    commentCount: number;

    @AfterCreate
    @AfterRestore
    static async incrementRepostCount(post: Post) {
        if (post.type == 2) {
            let whereRepost = {
                userId: post.userId,
                repostId: post.repostId,
            };
            let existRepost = await Repost.findOne({
                where: whereRepost,
                paranoid: false
            });
            if (!existRepost) {
                await Repost.create({
                    postId: post.id,
                    ...whereRepost
                })
            } else if (existRepost.deletedAt) {
                await existRepost.restore();
                existRepost.changed('createdAt', true);
                existRepost.set('createdAt', new Date(), { raw: true });
                await existRepost.save({
                    fields: ['createdAt']
                });
            }
            await Post.increment('repostCount', {
                where: {
                    id: post.repostId
                },
            });
        }
    }

    @AfterDestroy
    static async decrementRepostCount(post: Post) {
        if (post.type == 2) {
            let whereRepost = {
                userId: post.userId,
                repostId: post.repostId,
            };
            let existRepost = await Repost.findOne({
                where: whereRepost,
                paranoid: false
            });
            await existRepost.destroy();
            await Post.decrement('repostCount', {
                where: {
                    id: post.repostId,
                    repostCount: { [Op.gte]: 0 }
                },
            });
        }
    }
}
