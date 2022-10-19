import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Attachment } from "src/models/attachment.model";
import { Comment } from "src/models/comment.model";
import { Follower } from "src/models/follower.model";
import { Like } from "src/models/like.model";
import { Post } from "src/models/post.model";
import { Repost } from "src/models/repost.model";
import { JwtUserDTO } from "../auth/dto/JwtUser.dto";
import { CreatePostDto } from "./dto/create-post.dto";
import { CreateRepostDto } from './dto/create-re-post.dto';
import { User } from "src/models/user.model";
import { Op, QueryTypes } from "sequelize";

import { GetPostDto } from "./dto/get-posts-dto";
import { Brand } from "src/models/brand.model";
import { resolve } from "node:path/win32";
@Injectable()
export class PostService {
    constructor(
        @InjectModel(Post)
        private postModel: typeof Post,
        @InjectModel(Attachment)
        private attachmentModel: typeof Attachment,
        @InjectModel(Repost)
        private repostModel: typeof Repost,
        @InjectModel(Like)
        private likeModel: typeof Like,
    ) { }

    async addAttachment(createArray: any) {
        await this.attachmentModel.create(createArray);
    }

    async getPosts(getPostDto: GetPostDto, jwtUserDTO?: JwtUserDTO) {
        let userId = null;
        if (getPostDto.type == "brand") {
            const brand = await Brand.findOne({
                where: { slug: getPostDto.slug },
            });
            if (!brand) {
                throw new NotFoundException();
            }
            userId = brand.userId;
        }
        if (getPostDto.type == "retailer") {
            const retailer = await User.findOne({
                where: { slug: getPostDto.slug },
            });
            if (!retailer) {
                throw new NotFoundException();
            }
            userId = retailer.id;
        }
        const limit = + getPostDto.limit;
        const offset = (+getPostDto.page) * limit;

        const posts = await this.postModel.findAndCountAll({
            //logging: console.log,
            distinct: true,
            include: [
                {
                    model: User,
                },
                {
                    model: Attachment,
                },
                {
                    model: Post,
                    as: 'parentPost',
                    include: [
                        {
                            model: User,
                        },
                        {
                            model: Attachment
                        },
                    ]
                },
            ],
            where: { userId: userId, isActive: 1 },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
        let { count, rows } = posts;
        const resetPosts = await Promise.all(rows.map(async (post) => {
            let isReposted = null;
            let isLiked = null;
            let isCommneted = null;
            if (post.type == 2) {
                if (jwtUserDTO?.id) {
                    isReposted = await post.parentPost.$get('reposts', {
                        where: { userId: jwtUserDTO.id }
                    });
                    isLiked = await post.parentPost.$get('likes', {
                        where: { userId: jwtUserDTO.id }
                    });
                }
                post = post.toJSON();
                return {
                    ...post, isReposted: isReposted?.length > 0 ? true : false, isLiked: isLiked?.length > 0 ? true : false, parentPost: { ...post.parentPost, isReposted: isReposted?.length > 0 ? true : false, isLiked: isLiked?.length > 0 ? true : false }
                }
            } else {
                if (jwtUserDTO?.id) {
                    isReposted = await post.$get('reposts', {
                        where: { userId: jwtUserDTO.id }
                    });
                    isLiked = await post.$get('likes', {
                        where: { userId: jwtUserDTO.id }
                    });
                }
                post = post.toJSON();
                return {
                    ...post, isReposted: isReposted?.length > 0 ? true : false, isLiked: isLiked?.length > 0 ? true : false
                }
            }
        }))
        return { count, rows: resetPosts }
    }

    async getUserPosts(userId: number) {
        const posts = await this.postModel.findAndCountAll({
            //logging: console.log,
            include: [
                // {
                //     model: User, as: 'fromUser'
                // },
                // {
                //     model: Attachment
                // },
                // {
                //     model: Repost,
                //     attributes: ['id']
                // },
                // {
                //     model: Comment,
                //     attributes: ['id']
                // },
                // {
                //     model: Like,
                //     attributes: ['id']
                // }
            ],

            where: {
                [Op.and]: [
                    { isActive: 1 },
                    { fromId: userId }
                ]
            },
            order: [['id', 'ASC']],
        });
        return posts;
    }

    async getPost(postId) {
        const post = await this.postModel.findOne({
            include: [
                {
                    model: User,
                },
                {
                    model: Attachment,
                },
                {
                    model: Post,
                    as: 'parentPost',
                    include: [
                        {
                            model: User,
                        },
                        {
                            model: Attachment
                        }
                    ]
                },
            ],
            where: {
                id: postId,
                isActive: 1,
            }
        });
        return post;
    }

    async createPost(createPostDto: CreatePostDto, jwtUserDTO: JwtUserDTO, attachment: any) {
        let newPost = await this.postModel.create({
            userId: jwtUserDTO.id,
            type: createPostDto.type,
            post: createPostDto.post,
            postUniqueId: Date.now().toString(36) + Math.random().toString(36).substring(2)
        })
        await attachment.map(async (uploadedFile: any) => {
            await this.addAttachment({
                attachableId: newPost.id,
                attachableType: createPostDto.attachableType,
                attachmentType: uploadedFile.mimetype.substring(0, 5) == 'image' ? 1 : 2,
                attachment: uploadedFile.path.substring(9)
            })
        })
        await newPost.reload();
        await newPost.$get('attachments');
        const post = await this.getPost(newPost.id);
        return { ...post.toJSON(), isReposted: false, isLiked: false };
    }

    async createRepost(createRepostDto: CreateRepostDto, jwtUserDTO: JwtUserDTO) {
        const post = await this.findOne(createRepostDto.repostId);
        const whereData = {
            userId: jwtUserDTO.id,
            type: 2,
            repostId: createRepostDto.repostId,
        }
        const existsRepostData = await this.postModel.findOne({
            where: whereData,
            paranoid: false
        })
        let hasUserReposted = false;
        if (!existsRepostData) {
            await this.postModel.create({
                ...whereData,
                post: createRepostDto.post,
                postUniqueId: Date.now().toString(36) + Math.random().toString(36).substring(2)
            })
            hasUserReposted = true;
        } else if (existsRepostData.deletedAt) {
            await existsRepostData.restore();
            existsRepostData.changed('createdAt', true);
            existsRepostData.set('createdAt', new Date(), { raw: true });
            await existsRepostData.save({
                fields: ['createdAt']
            });
            hasUserReposted = true;
        } else {
            await existsRepostData.destroy();
            hasUserReposted = false;
        }
        const ParentPost = await this.postModel.findOne({
            where: { id: post.id }
        });

        return {
            totalRepostOnPost: ParentPost.repostCount,
            hasUserReposted: hasUserReposted
        };

        // const repostData = await this.repostModel.create({
        //     userId: jwtUserDTO.id,
        //     repostId: createRepostDto.repostId,
        //     postId: repost.id
        // })

    }

    async getReposts(postUniqueId, page, limit, jwtUserDTO: JwtUserDTO) {
        const post = await this.findbyUniqueId(postUniqueId);
        const reposts = await Post.findAndCountAll({
            include: [
                {
                    model: User,
                    include: [
                        {
                            model: Follower,
                            as: 'followers',
                            where: {
                                followerId: jwtUserDTO.id,
                                isActive: 1
                            },
                            required: false,
                        }
                    ]
                }
            ],
            where: {
                repostId: post.id,
                isActive: 1
            },
            limit: +limit,
            offset: (+limit) * (+page)
        })
        return reposts;
    }

    async getLikes(postUniqueId, page, limit, jwtUserDTO: JwtUserDTO) {
        const post = await this.findbyUniqueId(postUniqueId);
        const likes = await Like.findAndCountAll({
            include: [
                {
                    model: User,
                    include: [
                        {
                            model: Follower,
                            as: 'followers',
                            where: {
                                followerId: jwtUserDTO.id,
                                isActive: 1
                            },
                            required: false,
                        }
                    ]
                }
            ],
            where: {
                postId: post.id,
                isActive: 1
            },
            limit: +limit,
            offset: (+limit) * (+page)
        })
        return likes;
    }

    async findbyUniqueId(postUniqueId) {
        const post = await this.postModel.findOne({
            where: {
                postUniqueId: postUniqueId,
                isActive: 1
            }
        })
        if (!post) {
            throw new NotFoundException('Post Not Founded!');
        }
        return post;
    }

    async handlePostLike(postId, jwtUserDTO: JwtUserDTO) {
        const post = await this.findOne(postId);
        const likeData = {
            postId: post.id,
            userId: jwtUserDTO.id
        }
        const existsLikeData = await this.likeModel.findOne({
            where: likeData,
            paranoid: false
        })
        let hasUserLikedPost = false;
        if (!existsLikeData) {
            await this.likeModel.create(likeData);
            hasUserLikedPost = true;
        } else if (existsLikeData.deletedAt) {
            await existsLikeData.restore();
            hasUserLikedPost = true;
        } else {
            await existsLikeData.destroy();
            hasUserLikedPost = false;
        }
        const { count: likeCount } = await this.likeModel.findAndCountAll({
            where: { postId: post.id }
        })

        return {
            totalLikesOnPost: likeCount,
            hasUserLikedPost
        };
    }

    async getSingle(postUniqueId, jwtUserDTO?: JwtUserDTO) {
        let singlePost = await this.postModel.findOne({
            where: {
                postUniqueId: postUniqueId,
                isActive: 1
            },
            include: [
                {
                    model: User,
                },
                {
                    model: Attachment,
                },
                {
                    model: Post,
                    as: 'parentPost',
                    include: [
                        {
                            model: User,
                        },
                        {
                            model: Attachment
                        }
                    ]
                },
            ],
        })
        if (!singlePost) {
            throw new NotFoundException('Post Not Founded!');
        }
        let isReposted = null;
        let isLiked = null;
        let isCommneted = null;
        if (singlePost.type == 2) {
            if (jwtUserDTO.id) {
                isReposted = await singlePost.parentPost.$get('reposts', {
                    where: { userId: jwtUserDTO.id }
                });
                isLiked = await singlePost.parentPost.$get('likes', {
                    where: { userId: jwtUserDTO.id }
                });
            }
            singlePost = singlePost.toJSON();
            return {
                ...singlePost, isReposted: isReposted?.length > 0 ? true : false, isLiked: isLiked?.length > 0 ? true : false, parentPost: { ...singlePost.parentPost, isReposted: isReposted?.length > 0 ? true : false, isLiked: isLiked?.length > 0 ? true : false }
            }
        } else {
            if (jwtUserDTO.id) {
                isReposted = await singlePost.$get('reposts', {
                    where: { userId: jwtUserDTO.id }
                });
                isLiked = await singlePost.$get('likes', {
                    where: { userId: jwtUserDTO.id }
                });
            }
            singlePost = singlePost.toJSON();
            return {
                ...singlePost, isReposted: isReposted?.length > 0 ? true : false, isLiked: isLiked?.length > 0 ? true : false
            }
        }
    }

    async findOne(postId) {
        const post = this.postModel.findOne({
            where: {
                id: postId,
                isActive: 1,
            }
        })
        if (!post) {
            throw new NotFoundException('Post Not Founded!');
        }
        return post;
    }

    async getAxisPointPosts(limit, page, jwtUserDTO?: JwtUserDTO) {
        let posts;
        const offset = (page) * limit;
        if (jwtUserDTO.id) {
            let userId = jwtUserDTO.id;
            posts = await this.postModel.findAndCountAll({
                distinct: true,
                include: [
                    {
                        model: Follower,
                        attributes: [],
                        required: true,
                        on: {
                            [Op.or]: [{
                                [Op.and]: [
                                    {
                                        'followerId': {
                                            [Op.col]: 'Post.userId'
                                        }
                                    },
                                    {
                                        'followingId': userId
                                    }
                                ]
                            }, {
                                '$Post.userId$': userId
                            }]
                        },
                    },
                    {
                        model: User,
                        required: true,
                    },
                    {
                        model: Attachment,
                    },
                    {
                        model: Post,
                        as: 'parentPost',
                        include: [
                            {
                                model: User,
                            },
                            {
                                model: Attachment
                            },
                        ]
                    },
                ],
                where: { isActive: 1 },
                limit,
                offset,
                order: [['createdAt', 'DESC']],
            });
        } else {
            posts = await this.postFindAndCountAll(limit, offset);
        }
        let { count, rows } = posts;
        const resetPosts = await Promise.all(rows.map(async (post) => {
            let isReposted = null;
            let isLiked = null;
            let isCommneted = null;
            if (post.type == 2) {
                if (jwtUserDTO.id) {
                    isReposted = await post.parentPost.$get('reposts', {
                        where: { userId: jwtUserDTO.id }
                    });
                    isLiked = await post.parentPost.$get('likes', {
                        where: { userId: jwtUserDTO.id }
                    });
                }
                post = post.toJSON();
                return {
                    ...post, isReposted: isReposted?.length > 0 ? true : false, isLiked: isLiked?.length > 0 ? true : false, parentPost: { ...post.parentPost, isReposted: isReposted?.length > 0 ? true : false, isLiked: isLiked?.length > 0 ? true : false }
                }
            } else {
                if (jwtUserDTO.id) {
                    isReposted = await post.$get('reposts', {
                        where: { userId: jwtUserDTO.id }
                    });
                    isLiked = await post.$get('likes', {
                        where: { userId: jwtUserDTO.id }
                    });
                }
                post = post.toJSON();
                return {
                    ...post, isReposted: isReposted?.length > 0 ? true : false, isLiked: isLiked?.length > 0 ? true : false
                }
            }
        }))
        return { count, rows: resetPosts }
    }

    async postFindAndCountAll(limit, offset) {
        const posts = await this.postModel.findAndCountAll({
            //logging: console.log,
            distinct: true,
            include: [
                {
                    model: User,
                },
                {
                    model: Attachment,
                },
                {
                    model: Post,
                    as: 'parentPost',
                    include: [
                        {
                            model: User,
                        },
                        {
                            model: Attachment
                        },
                    ]
                },
            ],
            where: { isActive: 1 },
            limit,
            offset,
            order: [['createdAt', 'DESC']],
        });
        return posts;
    }

}