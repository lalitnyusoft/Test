import { FilesInterceptor } from '@nestjs/platform-express';
import { AuthGuard } from '@nestjs/passport';
import { Body, Controller, Post, Request, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { CommentService } from "./comment.services";
import { IResponse } from 'src/common/interfaces/response.interface';
import { CreateCommentDto } from './dto/create-comment.dto';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { CommentReplyDto } from './dto/comment-reply.dto';
import { GetCommentDto } from './dto/get-comments.dto';
import { diskStorage } from 'multer';
import path = require('path');
import { GetReplyDto } from './dto/get-reply.dto';

export const uploadFiles = {
    storage: diskStorage({
        destination: '../assets/postedMedia',
        filename: (req, file, cb) => {
            //console.log(file.originalname);
            let filename: string =
                path.parse('file-').name.replace(/\s/g, '') + Date.now() + '-' + Math.round(Math.random() * 1e9);
            filename = filename;
            const extension: string = path.parse(file.originalname).ext;
            cb(null, `${filename}${extension}`);
        },
    }),
}

@Controller()
export class CommentController {
    constructor(
        private readonly commentService: CommentService
    ) { }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    @UseInterceptors(FilesInterceptor('attachment', null, uploadFiles))
    async createComment(
        @Body() createCommentDto: CreateCommentDto,
        @Request() req,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<IResponse> {
        const isCreated = await this.commentService.createComment(createCommentDto, req.user, files);
        return new ResponseSuccess('commented successfully.', isCreated);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('reply')
    @UseInterceptors(FilesInterceptor('attachment', null, uploadFiles))
    async commentReply(
        @Body() commentReplyDto: CommentReplyDto,
        @Request() req,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<IResponse> {
        const isCreated = await this.commentService.commentReply(commentReplyDto, req.user, files);
        return new ResponseSuccess('replied successfully.', isCreated);
    }

    @Post('/list')
    async getComment(
        @Body() getCommentDto: GetCommentDto,
    ): Promise<IResponse> {
        const comments = await this.commentService.getComment(getCommentDto);
        return new ResponseSuccess('Comments', comments);
    }

    @Post('/replyList')
    async getReplies(
        @Body() getReplyDto: GetReplyDto,
    ): Promise<IResponse> {
        const reply = await this.commentService.getReplies(getReplyDto);
        return new ResponseSuccess('reply', reply);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/like')
    async handleCommentLike(
        @Body('commentId') commentId: string,
        @Request() req,
    ): Promise<IResponse> {
        const like = await this.commentService.handleCommentLike(+commentId, req.user);
        return new ResponseSuccess('comment liked', like);
    }

    @Post('/singleCommentReplies')
    async getSingleCommentReplies(
        @Body('commentId') commentId: String,
        @Body('limit') limit: String,
        @Body('page') page: String,
    ): Promise<IResponse> {
        const reply = await this.commentService.getSingleCommentReplies(+commentId, +limit, +page);
        return new ResponseSuccess('replies', reply);
    }
}