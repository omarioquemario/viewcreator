import { Application, Request, Response } from 'express';
import { ApiResult, ApiError } from './api_error';
import * as IPFS from '../services/ipfs';

const cors = require('cors');


const api_base_path = '/api/';


const MEGABYTE = 1000000;


class Routes {

    constructor(app: Application) {
        this.set_cors(app);
        this.set_routes(app);
    }

    set_cors(app: Application) {
        if (process.env.NODE_ENV == 'development') {
            app.options('*', cors({ credentials: true, origin: ['file://'] }));
            app.use(cors({ credentials: true, origin: ['file://'] }));
        }
    }

    set_routes(app: Application) {
        app.route(api_base_path + 'publish-on-ipfs').post(async (req: Request, res: Response) => {
            let api_result: ApiResult = new ApiResult();

            try {
                if (!req.body.data_as_base64) throw { code: 'NO_VIEW', message: 'Missing param: data_as_base64' };
                if (req.body.data_as_base64.length > 1 * MEGABYTE) throw { code: 'DATA_SIZE_LIMIT', message: 'A base64 representation of the data must be less than 1 megabyte' };

                const data_as_byte_array = Buffer.from(req.body.data_as_base64, 'base64');
                const url = await IPFS.publish(data_as_byte_array);
                console.log(`Published ${data_as_byte_array.length} bytes of data on IPFS -> ${url}`);
                api_result.set('ipfs_url', url);
            }
            catch (e) {
                api_result.add_error({ code: (e.code ? e.code : 'IPFS_ERROR'), message: e.message });
            }
            finally {
                api_result.output(res);
            }

        });
    }

}

export default Routes;
