import { Request, Response, ErrorRequestHandler, NextFunction } from 'express';

export function errorHandlerApi(err: ErrorRequestHandler, req: Request, res: Response, next: NextFunction) {
    console.error(`API error handler executed: ${err}`);
    res.status(500).json({
        errorCode: '001',
        message: 'Internal server error!'
    });
}