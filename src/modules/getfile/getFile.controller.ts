import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Res } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller()
export class GetFileController {
  constructor() {}
  
  // @UseGuards(AuthGuard('jwt'))
  @Get(':filepath/:filename')
  seeUploadedFile(
    @Param('filename') filename,
    @Param('filepath') filepath,
    @Res() res,
  ): string {
    return res.sendFile(filename, { root: '../assets/' + filepath + '/' });
  }
}
