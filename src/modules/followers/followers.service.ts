
import { Injectable, NotFoundException } from '@nestjs/common';
import sequelize, { Op } from 'sequelize';
import { Follower } from 'src/models/follower.model';
import { User } from 'src/models/user.model';
import { JwtUserDTO } from '../auth/dto/JwtUser.dto';

@Injectable()
export class FollowersService {

    async getFollowers(jwtUserDto: JwtUserDTO, userSlug, offset: number = 0, limit: number = 10) {
        const { count, rows: followers } = await Follower.findAndCountAll({
            distinct: true,
            include: [{
                model: User,
                as: 'followerUser',
                required: false,
                attributes: ['businessName', 'fullName', 'profilePath', 'slug', 'role', 'brandName'],
                include: [
                    {
                        model: Follower,
                        as: 'followers',
                        where: {
                            isActive: 1,
                            'followerId': {
                                [Op.eq]: jwtUserDto.id
                            },
                        },
                        required: false,
                    }]

            }, {
                model: User,
                as: 'followingUser',
                required: false,
                attributes: ['id', 'slug'],
                where: {
                    slug: userSlug
                }
            }],
            where: {
                followingId: { [Op.col]: 'followingUser.id' },
                isActive: 1,
                followerId: {
                    [Op.not]: { [Op.col]: 'followingUser.id' }
                }
            },
            offset: offset ? offset * limit : 0,
            limit: limit,
            subQuery: false,
        });
        return {
            count: count,
            currentPage: offset ? +offset : 0,
            totalPages: Math.ceil(count / limit),
            followers: followers,
        };
    }

    async toggleFollow(jwtUserDTO: JwtUserDTO, slug) {
        const user = await User.findOne({
            where: {
                slug: slug,
                isActive: 1
            },
        })
        if (!user) throw new NotFoundException('User not found');
        if (user.id != jwtUserDTO.id) {
            const newFollower = {
                followingId: user.id,
                followerId: jwtUserDTO.id,
                isActive: 1
            };
            const where = {
                followingId: user.id,
                followerId: jwtUserDTO.id,
            }
            const follower = await Follower.findOne({ where })
            if (!follower) {
                const follow = await Follower.create(newFollower)
                return { follow: true };
            } else if (follower.isActive) {
                const unfollow = await Follower.update({ ...newFollower, isActive: 0 }, { where, individualHooks: true });
                return { follow: false };
            } else {
                const follow = await Follower.update(newFollower, { where, individualHooks: true });
                return { follow: true };
            }
        }
        return null;
    }

    async getFollowings(jwtUserDto: JwtUserDTO, userSlug, offset: number = 0, limit: number = 10) {
        const { count, rows: followings } = await Follower.findAndCountAll({
            distinct: true,
            include: [{
                model: User,
                as: 'followingUser',
                required: false,
                attributes: ['businessName', 'fullName', 'profilePath', 'slug', 'role', 'brandName'],
                include: [
                    {
                        model: Follower,
                        as: 'followers',
                        where: {
                            isActive: 1,
                            'followerId': {
                                [Op.eq]: jwtUserDto.id
                            },
                        },
                        required: false,
                    }]

            },
            {
                model: User,
                as: 'followerUser',
                required: false,
                attributes: ['id', 'slug'],
                where: {
                    slug: userSlug
                }
            }
            ],
            where: {
                isActive: 1,
                followerId: { [Op.col]: 'followerUser.id' },
                followingId: {
                    [Op.not]: { [Op.col]: 'followerUser.id' },
                }
            },
            offset: offset ? offset * limit : 0,
            limit: limit,
            subQuery: false,
        });
        return {
            count: count,
            currentPage: offset ? +offset : 0,
            totalPages: Math.ceil(count / limit),
            followings: followings,
        };
    }
}