import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Cms } from '../../models/cms.model';
import { CmsController } from './cms.controller';
import { CmsService } from './cms.service';
@Module({
  imports: [SequelizeModule.forFeature([Cms])],
  controllers: [CmsController],
  providers: [CmsService],
})
export class CmsModule {}