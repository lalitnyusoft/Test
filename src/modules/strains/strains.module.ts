import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { Strain } from 'src/models/strain.model';
import { StrainsController } from './strains.controller';
import { StrainsService } from './strains.service';

@Module({
    imports: [
    SequelizeModule.forFeature([
        Strain
    ]),
    ],
  controllers: [StrainsController],
  providers: [StrainsService]
})
export class StrainsModule { }
