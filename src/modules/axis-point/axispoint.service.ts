import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { AxisPoint } from 'src/models/axisPoint.model';

@Injectable()
export class AxisPointService {
    constructor(
        @InjectModel(AxisPoint)
        private axisPointModel: typeof AxisPoint,
    ) { }

    async storeMedia(media: any){
        console.log(media);
    }
    
    async getMedia(){
        const axisPointMedia = await this.axisPointModel.findAll({
            where: { isActive: '1' }
        });
        return axisPointMedia;
    }
}
