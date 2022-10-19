import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { AxisPointService } from './axispoint.service';

@Controller()
export class AxisPointController {
    constructor(private readonly axisPointService: AxisPointService){}

    @Get()
    async getMedia(){
        const media = await this.axisPointService.getMedia();
        return new ResponseSuccess('media',  media );
    }

    @Post()
    async storeMedia(
        @Body() media: any
    ) {
        const data = await this.axisPointService.storeMedia(media);
        return new ResponseSuccess('data',  data);
    }
}
