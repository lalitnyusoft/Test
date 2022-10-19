import { Module } from "@nestjs/common";
import { SequelizeModule } from "@nestjs/sequelize";
import { Attachment } from "src/models/attachment.model";
import { Comment } from "src/models/comment.model";
import { CommentLike } from "src/models/commentLike.model";
import { CommentReply } from "src/models/commentReply.model";
import { User } from "src/models/user.model";
import { CommentController } from "./comment.controller";
import { CommentService } from "./comment.services";

@Module({
    imports: [SequelizeModule.forFeature([
        Comment, CommentReply, User, Attachment, CommentLike
    ])],
    controllers: [CommentController],
    providers: [CommentService],
})

export class CommentModule { }