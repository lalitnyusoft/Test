import { Module } from '@nestjs/common';
import { MessagesService } from './messages.service';
import { MessagesController } from './messages.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Message } from 'src/models/message.model';
import { Brand } from 'src/models/brand.model';
import { User } from 'src/models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([
    Message,
    Brand,
    User
  ])],
  controllers: [MessagesController],
  providers: [MessagesService]
})
export class MessagesModule { }
