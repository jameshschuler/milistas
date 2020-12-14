import { StatusCodes } from 'http-status-codes';

export class AppError extends Error {
    private _statusCode: StatusCodes;

    constructor( message: string, statusCode: StatusCodes ) {
        super( message );

        this._statusCode = statusCode;
    }

    public get statusCode () { return this._statusCode; }
}