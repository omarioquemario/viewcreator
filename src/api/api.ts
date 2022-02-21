import express from 'express';
import { Application } from 'express';
import bodyParser from 'body-parser';
import Routes from './routes';
import { errorHandlerApi } from './errorHandlerApi';



class Api {

    public express: Application;

    constructor() {
        this.express = express();
        this.middleware();
    }

    static force_encryption(req, res, next: Function) {
        if (req.secure === true || req.headers['x-forwarded-proto'] === 'https') {
            next(); // request was via https, so do no special handling
        } else {
            res.redirect('https://' + req.headers.host + req.url); // request was via http, so redirect to https
        }
    }

    middleware(): void {
        if (process.env.NODE_ENV == 'production') {
            this.express.use(Api.force_encryption);
        }
        this.express.use(express.static('./src/public')); // Serve static files.
        this.express.use(errorHandlerApi);
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
        this.router(this.express);
    }

    private router(app: Application): void {
        new Routes(app);
    }

}

export default new Api().express;