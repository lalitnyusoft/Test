import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Settings } from 'src/models/settings.model';
import { User } from 'src/models/user.model';
import { UserSubscription } from 'src/models/userSubscription.model';
import { HelperService } from 'src/services/Helper.service';
const moment = require('moment');
const fs = require('fs');
@Injectable()
export class SubscriptionService {
    constructor(
        @InjectModel(Settings)
        private settingsModel: typeof Settings,
        @InjectModel(UserSubscription)
        private userSubscriptionModel: typeof UserSubscription,
        @InjectModel(User)
        private userModel: typeof User,
    ) { }

    async updateSubscription(){
      // reqBody: any
        const reqBody = {
          "id": "evt_1LSJiML7LbGWLINIHOrwd3FT",
          "object": "event",
          "api_version": "2020-08-27",
          "created": 1659441405,
          "data": {
            "object": {
              "id": "sub_1LSJW3L7LbGWLINI7LVIfSkY",
              "object": "subscription",
              "application": null,
              "application_fee_percent": null,
              "automatic_tax": {
                "enabled": false
              },
              "billing_cycle_anchor": 1659441401,
              "billing_thresholds": null,
              "cancel_at": null,
              "cancel_at_period_end": false,
              "canceled_at": null,
              "collection_method": "charge_automatically",
              "created": 1659441401,
              "currency": "usd",
              "current_period_end": 1662119801,
              "current_period_start": 1659441401,
              "customer": "cus_MAf2XCLd4c6h6c",
              "days_until_due": null,
              "default_payment_method": null,
              "default_source": null,
              "default_tax_rates": [
                
              ],
              "description": null,
              "discount": null,
              "ended_at": null,
              "items": {
                "object": "list",
                "data": [
                  {
                    "id": "si_MAf20aQtPFfa49",
                    "object": "subscription_item",
                    "billing_thresholds": null,
                    "created": 1659441401,
                    "metadata": {
                      
                    },
                    "plan": {
                      "id": "plan_MAf22CSZBY5fRq",
                      "object": "plan",
                      "active": true,
                      "aggregate_usage": null,
                      "amount": 2000,
                      "amount_decimal": "2000",
                      "billing_scheme": "per_unit",
                      "created": 1659441400,
                      "currency": "usd",
                      "interval": "month",
                      "interval_count": 1,
                      "livemode": false,
                      "metadata": {
                        
                      },
                      "nickname": null,
                      "product": "prod_MAf24WJqqFeZhH",
                      "tiers_mode": null,
                      "transform_usage": null,
                      "trial_period_days": null,
                      "usage_type": "licensed"
                    },
                    "price": {
                      "id": "plan_MAf22CSZBY5fRq",
                      "object": "price",
                      "active": true,
                      "billing_scheme": "per_unit",
                      "created": 1659441400,
                      "currency": "usd",
                      "custom_unit_amount": null,
                      "livemode": false,
                      "lookup_key": null,
                      "metadata": {
                        
                      },
                      "nickname": null,
                      "product": "prod_MAf24WJqqFeZhH",
                      "recurring": {
                        "aggregate_usage": null,
                        "interval": "month",
                        "interval_count": 1,
                        "trial_period_days": null,
                        "usage_type": "licensed"
                      },
                      "tax_behavior": "unspecified",
                      "tiers_mode": null,
                      "transform_quantity": null,
                      "type": "recurring",
                      "unit_amount": 2000,
                      "unit_amount_decimal": "2000"
                    },
                    "quantity": 1,
                    "subscription": "sub_1LSJiHL7LbGWLINIRFMjkVcs",
                    "tax_rates": [
                      
                    ]
                  }
                ],
                "has_more": false,
                "total_count": 1,
                "url": "/v1/subscription_items?subscription=sub_1LSJiHL7LbGWLINIRFMjkVcs"
              },
              "latest_invoice": "in_1LSJiHL7LbGWLINIeDKcOPgQ",
              "livemode": false,
              "metadata": {
                "foo": "bar"
              },
              "next_pending_invoice_item_invoice": null,
              "pause_collection": null,
              "payment_settings": {
                "payment_method_options": null,
                "payment_method_types": null,
                "save_default_payment_method": "off"
              },
              "pending_invoice_item_interval": null,
              "pending_setup_intent": null,
              "pending_update": null,
              "plan": {
                "id": "plan_MAf22CSZBY5fRq",
                "object": "plan",
                "active": true,
                "aggregate_usage": null,
                "amount": 2000,
                "amount_decimal": "2000",
                "billing_scheme": "per_unit",
                "created": 1659441400,
                "currency": "usd",
                "interval": "month",
                "interval_count": 1,
                "livemode": false,
                "metadata": {
                  
                },
                "nickname": null,
                "product": "prod_MAf24WJqqFeZhH",
                "tiers_mode": null,
                "transform_usage": null,
                "trial_period_days": null,
                "usage_type": "licensed"
              },
              "quantity": 1,
              "schedule": null,
              "start_date": 1659441401,
              "status": "active",
              "test_clock": null,
              "transfer_data": null,
              "trial_end": null,
              "trial_start": null
            },
            "previous_attributes": {
              "metadata": {
                "foo": null
              }
            }
          },
          "livemode": false,
          "pending_webhooks": 3,
          "request": {
            "id": "req_JVt7evFEZ1Y4Ag",
            "idempotency_key": "6f55f337-a0eb-4458-b74f-932f3940cbb5"
          },
          "type": "customer.subscription.updated"
        }
        const helperService = await new HelperService();
        const stripeKey = await helperService.getSettings(this.settingsModel, 'stripe_secret_key');
        let stripe: any;
        let requestData: any;
        try {
            stripe = require('stripe')(stripeKey.description);
            requestData = reqBody;
		        if(requestData && requestData !== ''){
                let response: any = JSON.stringify(requestData);
                response = JSON.parse(response);
                if(response.data.object.plan.id && +response.data.object.plan.id !== 2){
                    const userSubscription = await this.userSubscriptionModel.findOne({
                        where: {
                            subscriptionId: response.data.object.id
                            // subscriptionId: 'sub_1LQr3XEL540xF8yvjPHr0UR9'
                        },
                        order: [
                            ['createdAt', 'desc']
                        ]
                    });
                    if(userSubscription){
                        let subscribed = [];
                        subscribed['userId'] = userSubscription.userId;
                        subscribed['planId'] = userSubscription.planId;
                        subscribed['customerId'] = userSubscription.customerId;
                        subscribed['subscriptionToken'] = userSubscription.subscriptionToken;
                        subscribed['subscriptionId'] = userSubscription.subscriptionId;
                        subscribed['status'] = response.data.object.status;
                        subscribed['amount'] = null;
                        if(response.data.object.plan.amount){
                            subscribed['amount'] = (response.data.object.plan.amount / 100);
                        }
                        subscribed['responseJson'] = JSON.stringify(response);
                        subscribed['startDate'] = await moment(response.data.current_period_start).format('YYYY-MM-DD'); //current Date
                        subscribed['endDate'] = await moment(response.data.current_period_end).format('YYYY-MM-DD'); //end date 
                        const newSubscriptionId = await this.userSubscriptionModel.create({...subscribed});
                        const user = await this.userModel.findOne({
                            where: {
                              id: userSubscription.userId
                            }
                        })
                        user.update({ 
                          planExpiryDate: subscribed['endDate'],
                          subscriptionId: newSubscriptionId.id
                        });
                        return user;
                    }
                }
            }
            return
        }
        catch (err) {
          console.log(err)
          fs.appendFile('src/modules/subscription/error-logs.txt', JSON.stringify(err), (fsErr) => {
            if (fsErr) {
              console.log('fsErr', fsErr);
            }
          })
        }
    }
}
