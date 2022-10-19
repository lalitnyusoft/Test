import { FileFieldsInterceptor, FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { Body, Controller, Get, Param, Post, Query, Request, UploadedFile, UploadedFiles, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { ResponseSuccess } from "src/common/dto/response.dto";
import { IResponse } from "src/common/interfaces/response.interface";
import { CreatePostDto } from "./dto/create-post.dto";
import { PostService } from "./post.service";
import { diskStorage } from 'multer';
import path = require('path');
import { GetPostDto } from './dto/get-posts-dto';
import { CreateRepostDto } from './dto/create-re-post.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

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
export class PostController {
    constructor(private readonly postService: PostService) { }

    //@UseGuards(AuthGuard('jwt'))
    @UseGuards(JwtAuthGuard)
    @Post()
    async getPosts(
        @Body() getPostDto: GetPostDto,
        @Request() req,
    ): Promise<IResponse> {
        const posts = await this.postService.getPosts(getPostDto, req.user);
        return new ResponseSuccess('Posts', posts);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':userId')
    async getUserPosts(
        @Param('userId') userId: string
    ): Promise<IResponse> {
        const userPosts = await this.postService.getUserPosts(+userId);
        return new ResponseSuccess('Posts', userPosts);
    }
    @UseGuards(AuthGuard('jwt'))
    @Post('activity')
    @UseInterceptors(FilesInterceptor('attachment', null, uploadFiles))
    async createPost(
        @Body() createPostDto: CreatePostDto,
        @Request() req,
        @UploadedFiles() files: Array<Express.Multer.File>
    ): Promise<IResponse> {
        const isCreated = await this.postService.createPost(createPostDto, req.user, files);
        return new ResponseSuccess('Post successfully.', isCreated);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('repost')
    async createRepost(
        @Body() createRepostDto: CreateRepostDto,
        @Request() req,
    ): Promise<IResponse> {
        const isCreated = await this.postService.createRepost(createRepostDto, req.user);
        return new ResponseSuccess('Repost successfully.', isCreated);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':pId/reposts')
    async getReposts(
        @Param('pId') postUniqueId: string,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Request() req,
    ): Promise<IResponse> {
        const reposts = await this.postService.getReposts(postUniqueId, page, limit, req.user);
        return new ResponseSuccess('Reposts', reposts);
    }

    @UseGuards(AuthGuard('jwt'))
    @Get(':pId/likes')
    async getLikes(
        @Param('pId') postUniqueId: string,
        @Query('page') page: string,
        @Query('limit') limit: string,
        @Request() req,
    ): Promise<IResponse> {
        const likes = await this.postService.getLikes(postUniqueId, page, limit, req.user);
        return new ResponseSuccess('Likes', likes);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post('/handlePostLike')
    async handlePostLike(
        @Body('pId') postId: string,
        @Request() req,
    ): Promise<IResponse> {
        const like = await this.postService.handlePostLike(+postId, req.user);
        return new ResponseSuccess('post liked', like);
    }


    @UseGuards(JwtAuthGuard)
    @Get('single/:postUniqueId')
    async getSingle(
        @Param('postUniqueId') postUniqueId: string,
        // @Query('page') page: string,
        // @Query('limit') limit: string,
        @Request() req,
    ): Promise<IResponse> {
        const post = await this.postService.getSingle(postUniqueId, req.user);
        return new ResponseSuccess('Single post', [post]);
    }

    @UseGuards(JwtAuthGuard)
    @Post('axis-point')
    async getAxisPointPost(
        @Body('limit') limit: String,
        @Body('page') page: String,
        @Request() req,
    ): Promise<IResponse> {
        const posts = await this.postService.getAxisPointPosts(+limit, +page, req.user);
        return new ResponseSuccess('Posts', posts);
    }

}