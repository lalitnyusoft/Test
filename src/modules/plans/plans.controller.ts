import { Body, Controller, Delete, Get, Param, Post, Put, Request, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { AuthGuard } from '@nestjs/passport';
import { IResponse } from 'src/common/interfaces/response.interface';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { PlansDto } from './dto/Plans.dto';

@Controller()
export class PlansController {
    constructor(private readonly plansService: PlansService) { }

    // @UseGuards(AuthGuard('jwt'))
    @Get()
    async getPlans(): Promise<IResponse> {
        const plans = await this.plansService.getPlans();
        return new ResponseSuccess('Plans', plans);
    }

    @UseGuards(AuthGuard('jwt'))
    @Post()
    async createPlan(
        @Body() createPlan: PlansDto,
    ): Promise<IResponse> {
        const isCreated = await this.plansService.createPlan(createPlan);
        return new ResponseSuccess('Plan added successfully.', { isCreated });
    }
}
