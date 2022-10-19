import { Controller, Get } from '@nestjs/common';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { StatesService } from './states.service';

@Controller()
export class StatesController {
    constructor(private readonly statesService: StatesService){}

    @Get()
    async getAllStates(){
        const states = await this.statesService.getAllStates();
        return new ResponseSuccess('States',  states );
    }
}
