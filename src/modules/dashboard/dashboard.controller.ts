import { Body, Controller, Get, Param, Post, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { DashboardService } from './dashboard.service';

@UseGuards(AuthGuard('jwt'))
@Controller()
export class DashboardController {
    constructor(private readonly dashboardService: DashboardService){}

    @Get('/orders/history')
    async getOrdersData(
        @Request() req,
    ){
        const ordersHistoryData = await this.dashboardService.getOrdersData(req.user);
        return new ResponseSuccess('ordersHistoryData',  ordersHistoryData );
    }

    @Post('/sold/by/strain')
    async getSoldByStrain(
        @Request() req,
        @Body('selectedMonth') selectedMonth: string
    ){
        const soldByStrainData = await this.dashboardService.getSoldByStrain(req.user, selectedMonth);
        return new ResponseSuccess('soldByStrainData',  soldByStrainData );
    }

    @Post('/sold/by/category')
    async getSoldByCategory(
        @Request() req,
        @Body('selectedMonth') selectedMonth: string
    ){
        const soldByCategoryData = await this.dashboardService.getSoldByCategory(req.user, selectedMonth);
        return new ResponseSuccess('soldByCategoryData',  soldByCategoryData );
    }
}
