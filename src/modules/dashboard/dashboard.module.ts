import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Brand } from 'src/models/brand.model';
import { Ioro } from 'src/models/ioro.model';
import { Order } from 'src/models/order.model';
import { DashboardController } from './dashboard.controller';
import { DashboardService } from './dashboard.service';

@Module({
    imports: [
    SequelizeModule.forFeature([
      Order,
      Brand
    ]),
    ],
  controllers: [DashboardController],
  providers: [DashboardService]
})
export class DashboardModule { }
