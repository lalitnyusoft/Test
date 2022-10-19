import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AppConstants } from 'src/constants/app.constant';


@Injectable()
export class OptionalStrategy extends PassportStrategy(Strategy, "optional") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: AppConstants.jwtSecret,
        });
    }

    // authenticate() {
    //     return this.success({})
    // }
}
