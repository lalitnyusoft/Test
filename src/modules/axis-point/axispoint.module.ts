import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AxisPoint } from 'src/models/axisPoint.model';
import { AxisPointController } from './axispoint.controller';
import { AxisPointService } from './axispoint.service';

@Module({
    imports: [
    SequelizeModule.forFeature([
      AxisPoint
    ]),
    ],
  controllers: [AxisPointController],
  providers: [AxisPointService]
})
export class AxisPointModule { }
