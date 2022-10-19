import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { State } from 'src/models/state.model';

@Injectable()
export class StatesService {
    constructor(
        @InjectModel(State)
        private stateModel: typeof State,
    ) { }

    async getAllStates(){
        const states = await this.stateModel.findAll({
            where: { isActive: '1' }
        });
        return states;
    }
}
