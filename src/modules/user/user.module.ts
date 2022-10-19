import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { SequelizeModule } from '@nestjs/sequelize';
import { User } from 'src/models/user.model';
import { Brand } from 'src/models/brand.model';
import { Follower } from 'src/models/follower.model';
// import { MailServiceService } from 'src/mail-service/mail-service.service';
//import { UserRoles } from 'src/models/userRole.model';

@Module({
  imports: [
    SequelizeModule.forFeature([
      User, Brand,Follower
    ]),
  ],
  controllers: [UserController],
  providers: [UserService],
  exports: [SequelizeModule, UserService],
})
export class UserModule { }
