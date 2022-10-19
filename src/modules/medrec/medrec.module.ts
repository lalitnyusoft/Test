import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { MedRec } from 'src/models/medRec.model';
import { MedRecController } from './medrec.controller';
import { MedRecService } from './medrec.service';

@Module({
    imports: [
    SequelizeModule.forFeature([
      MedRec
    ]),
    ],
  controllers: [MedRecController],
  providers: [MedRecService]
})
export class MedRecModule { }
