import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Strain } from 'src/models/strain.model';

@Injectable()
export class StrainsService {
    constructor(
        @InjectModel(Strain)
        private strainModel: typeof Strain,
    ) { }

    async getAllStrains(){
        const strains = await this.strainModel.findAll({
            where: { isActive: '1' }
        });
        return strains;
    }
}
