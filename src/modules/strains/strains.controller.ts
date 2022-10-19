import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { StrainsService } from './strains.service';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class StrainsController {
    constructor(private readonly strainsService: StrainsService){}

    @Get()
    async getAllStrains(){
        const strains = await this.strainsService.getAllStrains();
        return new ResponseSuccess('Strains',  strains );
    }
}
