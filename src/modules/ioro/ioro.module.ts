import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Ioro } from 'src/models/ioro.model';
import { IOROController } from './ioro.controller';
import { IOROService } from './ioro.service';

@Module({
    imports: [
    SequelizeModule.forFeature([
      Ioro
    ]),
    ],
  controllers: [IOROController],
  providers: [IOROService]
})
export class IOROModule { }
