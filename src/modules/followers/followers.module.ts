import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Follower } from 'src/models/follower.model';
import { User } from 'src/models/user.model';
import { FollowersController } from './followers.controlller';
import { FollowersService } from './followers.service';

@Module({
    imports:[SequelizeModule.forFeature([
        Follower, User
    ])],
    controllers: [FollowersController],
    providers: [FollowersService],
})
export class FollowersModule {}