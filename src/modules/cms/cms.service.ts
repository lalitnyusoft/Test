import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Cms } from '../../models/cms.model';

@Injectable()
export class CmsService {
  constructor(
    @InjectModel(Cms)
    private cmsModel: typeof Cms,
  ) {}
  async getCms(slug: string) {
    const content = this.cmsModel.findOne({ 
      where: { slug: slug } 
    });
    if (!content) throw new NotFoundException();
    return content;
  }

  // async postCms(slug: string, updatedCmsData: any, files: any) {
  //   const updatedData = await this.cmsModel.findOne({
  //     where: { slug }
  //   });
  //   for (const key in files) {
  //     let result = files[key].map(a => a.path);
  //     updatedCmsData[key] = result;
  //   }
  //   const newData = await updatedData.update({
  //     content: JSON.stringify(updatedCmsData)
  //   })
  //   return newData
  // }
}
