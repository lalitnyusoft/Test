import { IResponse } from '../interfaces/response.interface';

export class ResponseError implements IResponse {
    constructor(infoMessage: string, data?: any) {
        this.status = false;
        this.message = infoMessage;
        this.data = data;
        console.warn(
            new Date().toString() +
            ' - [Response]: ' +
            infoMessage +
            (data ? ' - ' + JSON.stringify(data) : ''),
        );
    }
    message: string;
    data: any[];
    status: boolean;
}

export class ResponseSuccess implements IResponse {
    constructor(infoMessage: string, data?: any) {
        this.status = true;
        this.message = infoMessage;
        this.data = data;
    }
    message: string;
    data: any[];
    success: boolean;
    status: boolean;
}
