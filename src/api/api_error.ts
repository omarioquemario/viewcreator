import { Response } from "express";

export interface IApiError {
    code: string;
    message: string;
    field?: string;
}

export class ApiError implements IApiError {
    code: string;
    message: string;
    field?: string; // Might be present or not.

    to_JSON = function (): Object {
        let ret: Object = {};
        for (let attr in this) {
            if (this.hasOwnProperty(attr)) {
                ret[attr] = this[attr];
            }
        }
        return ret;
    }

    constructor(json: Object) {
        if ((('code' in json) == false) || (('message' in json) == false)) {
            throw new Error('Error constructing ApiError object.');
        }
        Object.assign(this, json);
    }
}

export class ApiResult {
    succeed: boolean;
    errors: Array<IApiError>;

    constructor(errors: Array<IApiError> = []) {
        this.succeed = false;
        this.errors = (errors) ? errors : [];
    }

    to_JSON = function (): Object {
        let ret: Object = {};
        for (let attr in this) {
            if (this.hasOwnProperty(attr)) {
                ret[attr] = this[attr];
            }
        }
        return ret;
    }

    set = function (key: string, val: Object): ApiResult {
        let obj = {};
        obj[key] = val;
        Object.assign(this, obj);
        return this;
    }

    add_error = function (api_error: IApiError): void {
        this.errors.push(api_error);
    }

    output(res: Response): void {
        if (this.succeed != true) { // If it wasn't manually set to true, make it true if there were no errors.
            this.succeed = (this.errors.length == 0);
        }
        res.send(this.to_JSON());
    }

    static create = function (errors: Array<any>) {
        return new ApiResult(errors);
    }
}