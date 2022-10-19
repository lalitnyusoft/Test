import { Body, Controller, Get, Param, Post, Query, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseError, ResponseSuccess } from 'src/common/dto/response.dto';
import { IResponse } from 'src/common/interfaces/response.interface';
import { FollowersService } from './followers.service';

@Controller()
export class FollowersController {
  constructor(private readonly followersService: FollowersService) { }

  @UseGuards(AuthGuard('jwt'))
  @Get(':userSlug')
  async getFollowers(
    @Param('userSlug') userSlug: string,
    @Request() req,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ): Promise<IResponse> {
    const followers = await this.followersService.getFollowers(req.user, userSlug, +offset, +limit);
    return new ResponseSuccess('Followers', followers);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('/follow')
  async follow(
    @Request() req,
    @Body('slug') slug: string,
  ) {
    const toggleFollow = await this.followersService.toggleFollow(req.user, slug);
    if (toggleFollow) {
      return new ResponseSuccess('ToggleFollow', toggleFollow);
    } else {
      return new ResponseError('Something went wrong.', toggleFollow);
    }

  }

  @UseGuards(AuthGuard('jwt'))
  @Get('/followings/:userSlug')
  async getFollowings(
    @Param('userSlug') userSlug: string,
    @Request() req,
    @Query('offset') offset: string,
    @Query('limit') limit: string,
  ): Promise<IResponse> {
    const followings = await this.followersService.getFollowings(req.user, userSlug, +offset, +limit);
    return new ResponseSuccess('Followings', followings);
  }
}