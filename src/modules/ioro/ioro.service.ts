import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Ioro } from 'src/models/ioro.model';

@Injectable()
export class IOROService {
    constructor(
        @InjectModel(Ioro)
        private ioroModel: typeof Ioro,
    ) {}

    async getAllIoro(){
        const ioro = await this.ioroModel.findAll({
            where: { isActive: '1' }
        });
        return ioro;
    }
}
