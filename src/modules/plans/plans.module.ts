import { SequelizeModule } from '@nestjs/sequelize';
import { Module } from '@nestjs/common';
import { PlansController } from './plans.controller';
import { PlansService } from './plans.service';
import { Plans } from 'src/models/plans.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      Plans
    ])
  ],
  controllers: [PlansController],
  providers: [PlansService]
})
export class PlansModule { }