import { All, Controller, Get, Post, Request } from '@nestjs/common';
import { ResponseSuccess } from 'src/common/dto/response.dto';
import { SubscriptionService } from './subscription.service';
const fs = require('fs');

@Controller()
export class SubscriptionController {
    constructor(private readonly subscriptionService: SubscriptionService){}

    // @Get()
    @All()
    async updateSubscription(@Request() req){
        // fs.appendFile('./response.txt', JSON.stringify(req.body), (err) => {
        //     if (err) {
        //       console.log(err);
        //     }
        //   })
        // fs.writeFile('./response.txt', JSON.stringify(req.body),function (err) {
        //   if (err) {
        //     return console.log(err);
        //   }
        // })
        // req.body
        const response = await this.subscriptionService.updateSubscription();
    }
}
// http://192.168.1.152:3333/api/v1
// https://gmx.nyusoft.in:6002/api/v1/webhook-expired-plan
