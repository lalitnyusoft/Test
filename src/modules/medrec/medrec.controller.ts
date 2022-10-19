import { Controller, Get } from '@nestjs/common';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { MedRecService } from './medrec.service';

@Controller()
export class MedRecController {
    constructor(private readonly medRecService: MedRecService){}

    @Get()
    async getAllMedRec(){
        const medrec = await this.medRecService.getAllMedRec();
        return new ResponseSuccess('MedRec',  medrec );
    }
}
