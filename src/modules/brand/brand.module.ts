import { User } from 'src/models/user.model';
import { Brand } from './../../models/brand.model';
import { Module } from '@nestjs/common';
import { BrandService } from './brand.service';
import { BrandController } from './brand.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserSubscription } from 'src/models/userSubscription.model';
import { Settings } from 'src/models/settings.model';
import { Plans } from 'src/models/plans.model';
import { MailServiceService } from 'src/mail-service/mail-service.service';
import { State } from 'src/models/state.model';
import { Follower } from 'src/models/follower.model';

@Module({
  imports: [SequelizeModule.forFeature([User, Brand, UserSubscription, Settings, Plans, State, Follower])],
  controllers: [BrandController],
  providers: [BrandService, MailServiceService]
})
export class BrandModule { }
