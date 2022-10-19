import { Op } from 'sequelize';
import {
    Table,
    Column,
    PrimaryKey,
    AutoIncrement,
    ForeignKey,
    BelongsTo,
    AfterCreate,
    AfterUpdate,
} from 'sequelize-typescript';
import { BaseModel } from './baseModel';
import { User } from './user.model';

@Table({
    tableName: 'followers',
    // paranoid: true,
})
export class Follower extends BaseModel {
    @PrimaryKey
    @AutoIncrement
    @Column
    id: number;

    @ForeignKey(() => User)
    @Column
    followingId: number;
    @BelongsTo(() => User, 'followingId')
    followingUser: User;

    @ForeignKey(() => User)
    @Column
    followerId: number;
    @BelongsTo(() => User, 'followerId')
    followerUser: User;

    @AfterCreate
    static async incrementUserFollowersFollowingsCount(follower: Follower, options) {
        await User.increment('followersCount', {
            where: {
                id: follower.followingId
            },
            transaction: options.transaction
        });
        await User.increment('followingsCount', {
            where: {
                id: follower.followerId
            },
            transaction: options.transaction
        });
    }

    @AfterUpdate
    static async decrementUserFollowersFollowingsCount(follower: Follower) {
        if (!follower.isActive) {
            await User.decrement('followersCount', {
                where: {
                    id: follower.followingId,
                    followersCount: { [Op.gte]: 0 }
                },
            });
            await User.decrement('followingsCount', {
                where: {
                    id: follower.followerId,
                    followersCount: { [Op.gte]: 0 }
                },
            });
        } else if (follower.isActive) {
            await User.increment('followersCount', {
                where: {
                    id: follower.followingId
                },
            });
            await User.increment('followingsCount', {
                where: {
                    id: follower.followerId
                },
            });
        }
    }
}
