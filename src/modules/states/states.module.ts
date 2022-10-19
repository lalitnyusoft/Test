import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { State } from 'src/models/state.model';
import { StatesController } from './states.controller';
import { StatesService } from './states.service';

@Module({
    imports: [
    SequelizeModule.forFeature([
        State
    ]),
    ],
  controllers: [StatesController],
  providers: [StatesService]
})
export class StatesModule { }
