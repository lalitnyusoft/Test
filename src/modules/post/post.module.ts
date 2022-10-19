import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Attachment } from "src/models/attachment.model";
import { Comment } from "src/models/comment.model";
import { CommentReply } from "src/models/commentReply.model";
import { Like } from "src/models/like.model";
import { Post } from "src/models/post.model";
import { Repost } from "src/models/repost.model";
import { PostController } from "./post.controller";
import { PostService } from "./post.service";

@Module({
    imports: [
        SequelizeModule.forFeature([
            Post, Attachment, Repost, Comment, CommentReply, Like
        ])
    ],
    controllers: [PostController],
    providers: [PostService]
})
export class PostModule { }