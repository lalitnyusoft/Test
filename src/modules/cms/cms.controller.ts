import { Body, Controller, Get, Param, Post, UploadedFiles, UseInterceptors } from '@nestjs/common';
import { CmsService } from './cms.service';
import { IResponse } from '../../common/interfaces/response.interface';
import { ResponseSuccess } from '../../common/dto/response.dto';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import path = require('path');
const cmsImagesPath = '/cms';

// export const cmsImageStorage = {
//   storage: diskStorage({
//     // destination: '.' + cmsImagesPath,
//     destination: '../assets',
//     filename: (req, file, cb) => {
//       let filename: string =
//         path.parse('product-').name.replace(/\s/g, '') + uuidv4();
//       filename = filename;
//       const extension: string = path.parse(file.originalname).ext;
//       cb(null, `${filename}${extension}`);
//     },
//   }),
// };
@Controller()
export class CmsController {
  constructor(private readonly cmsService: CmsService) {}

  @Get(':type')
  async getCms(@Param() params): Promise<IResponse> {
    const response = await this.cmsService.getCms(params.type);
    response.content = JSON.parse(response.content);
    return new ResponseSuccess('Cms', response);
  }

  // @Post(':slug')
  // @UseInterceptors(FileFieldsInterceptor([
  //   { name: 'main_image_2' },
  //   { name: 'section2_image' },
  // ], cmsImageStorage))
  // async postCms(
  //   @UploadedFiles() files: { main_image_2?: Express.Multer.File[], background?: Express.Multer.File[] },
  //   @Param('slug') slug: string,
  //   @Body() updatedCmsData: any
  // ): Promise<IResponse> {
  //   const response = await this.cmsService.postCms(slug, updatedCmsData, files);
  //   return new ResponseSuccess('Cms', response);
  // }
}
