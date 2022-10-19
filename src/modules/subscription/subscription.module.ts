import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Settings } from 'src/models/settings.model';
import { User } from 'src/models/user.model';
import { UserSubscription } from 'src/models/userSubscription.model';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';

@Module({
    imports: [
    SequelizeModule.forFeature([
        Settings, UserSubscription, User
    ]),
    ],
  controllers: [SubscriptionController],
  providers: [SubscriptionService]
})
export class SubscriptionModule { }
