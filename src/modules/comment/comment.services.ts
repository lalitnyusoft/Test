import { GetReplyDto } from './dto/get-reply.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/sequelize";
import { Comment } from "src/models/comment.model";
import { JwtUserDTO } from '../auth/dto/JwtUser.dto';
import { CommentReplyDto } from './dto/comment-reply.dto';
import { CommentReply } from 'src/models/commentReply.model';
import { User } from 'src/models/user.model';
import { GetCommentDto } from './dto/get-comments.dto';
import { Attachment } from 'src/models/attachment.model';
import { CommentLike } from 'src/models/commentLike.model';

@Injectable()
export class CommentService {
    constructor(
        @InjectModel(Comment)
        private commentModel: typeof Comment,
        @InjectModel(CommentReply)
        private commentReplyModel: typeof CommentReply,
        @InjectModel(User)
        private userModel: typeof User,
        @InjectModel(Attachment)
        private attachmentModel: typeof Attachment,
        @InjectModel(CommentLike)
        private commentLikeModel: typeof CommentLike,
    ) { }

    async addAttachment(createArray: any) {
        await this.attachmentModel.create(createArray);
    }

    async createComment(createCommentDto: CreateCommentDto, jwtUserDTO: JwtUserDTO, attachment: any) {
        const comment = await this.commentModel.create({
            userId: jwtUserDTO.id,
            postId: createCommentDto.postId,
            comment: createCommentDto.comment,
            commentUniqueId: Date.now().toString(36) + Math.random().toString(36).substring(2)
        })

        await attachment.map(async (uploadedFile: any) => {
            await this.addAttachment({
                attachableId: comment.id,
                attachableType: 'comment',
                attachmentType: uploadedFile.mimetype.substring(0, 5) == 'image' ? 1 : 2,
                attachment: uploadedFile.path.substring(9)
            })
        })
        await comment.reload();
        return { comment, postCommentCount: (await comment.$get('post')).commentCount };
    }

    async commentReply(commentReplyDto: CommentReplyDto, jwtUserDTO: JwtUserDTO, attachment: any) {
        const reply = await this.commentReplyModel.create({
            commentId: commentReplyDto.commentId,
            userId: jwtUserDTO.id,
            reply: commentReplyDto.reply,
        })
        await attachment.map(async (uploadedFile: any) => {
            await this.addAttachment({
                attachableId: reply.id,
                attachableType: 'commentReply',
                attachmentType: uploadedFile.mimetype.substring(0, 5) == 'image' ? 1 : 2,
                attachment: uploadedFile.path.substring(9)
            })
        })
        return reply
    }

    async getComment(getCommentDto: GetCommentDto) {
        let condition = {}
        if (getCommentDto.postId) {
            condition = { 'postId': getCommentDto.postId }
        }
        const commentList = await this.commentModel.findAndCountAll({
            where: condition,
            attributes: ['id', 'postId', 'comment', 'commentUniqueId', 'replyCount', 'likeCount'],
            order: [
                ['id', 'DESC']
            ],
            include: [
                {
                    model: this.commentReplyModel,
                    limit: 3,
                    order: [
                        ['id', 'DESC'],
                    ],
                    include: [
                        {
                        model: this.userModel,
                        attributes: ['id', 'fullName', 'businessName', 'brandName', 'profilePath']
                        },
                        {
                            model: this.attachmentModel,
                        }
                    ]
                },
                {
                    model: this.userModel,
                    attributes: ['id', 'fullName', 'businessName', 'brandName', 'profilePath']
                },
                {
                    model: this.attachmentModel,
                }
            ]
        })
        return commentList
    }

    async getReplies(getReplyDto: GetReplyDto) {
        const reply = await this.commentModel.findAll({
            where: { 'commentUniqueId': getReplyDto.commentUniqueId },
            attributes: ["id", "userId", "postId", "comment", 'commentUniqueId', 'createdAt', 'replyCount', 'likeCount'],
            // order: [
            //     ['id', 'DESC']
            // ],
            include: [
                {
                    model: this.commentReplyModel,
                    order: [
                        ['id', 'DESC']
                    ],
                    attributes: ["id", "commentId", "userId", "reply", "createdAt"],
                    include: [
                        {
                        model: this.userModel,
                        attributes: ['id', 'fullName', 'businessName', 'brandName', 'profilePath']
                        },
                        {
                            model: this.attachmentModel,
                        }
                    ]
                },
                {
                    model: this.userModel,
                    attributes: ['id', 'fullName', 'businessName', 'brandName', 'profilePath']
                },
                {
                    model: this.attachmentModel,
                }
            ]
        })
        return reply;
    }

    async handleCommentLike(commentId, jwtUserDTO: JwtUserDTO) {
        const comment = await this.commentModel.findOne(commentId);
        const likeData = {
            commentId: comment.id,
            userId: jwtUserDTO.id
        }
        const existsLikeData = await this.commentLikeModel.findOne({
            where: likeData,
            paranoid: false
        })
        let hasUserLikedComment = false;
        if (!existsLikeData) {
            await this.commentLikeModel.create(likeData);
            hasUserLikedComment = true;
        } else if (existsLikeData.deletedAt) {
            await existsLikeData.restore();
            hasUserLikedComment = true;
        } else {
            await existsLikeData.destroy();
            hasUserLikedComment = false;
        }
        const { count: likeCount } = await this.commentLikeModel.findAndCountAll({
            where: { commentId: comment.id }
        })

        return {
            totalLikesOnComment: likeCount,
            hasUserLikedComment
        };
    }

    async getSingleCommentReplies(commentId: number, limit: number, page: number) {
        const offset = (page) * limit;
        const replies = await this.commentReplyModel.findAndCountAll({
            where: { 'commentId': commentId },
            attributes: ["id", "commentId", "userId", "reply", "createdAt"],
            limit,
            offset,
            order: [
                ['id', 'DESC']
            ],
            include: [
                {
                    model: this.userModel,
                    attributes: ['id', 'fullName', 'businessName', 'brandName', 'profilePath']
                },
                {
                    model: this.attachmentModel,
                }
            ]
        })
        return replies;
    }
}