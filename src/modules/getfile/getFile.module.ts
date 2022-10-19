import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { GetFileController } from './getFile.controller';

@Module({
  controllers: [GetFileController],
  providers: []
})
export class GetFileModule {}
