import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { MedRec } from 'src/models/medRec.model';

@Injectable()
export class MedRecService {
    constructor(
        @InjectModel(MedRec)
        private medRecModel: typeof MedRec,
    ) { }

    async getAllMedRec(){
        const medrec = await this.medRecModel.findAll({
            where: { isActive: '1' }
        });
        return medrec;
    }
}
