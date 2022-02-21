import * as http from 'http';
import * as https from 'https';
import Api from './api/api';
import * as IPFS from './services/ipfs';

const fs = require('fs');


if (process.env.NODE_ENV == undefined) process.env.NODE_ENV = 'development';


// Splash
console.log(`
View-Creator started in "${process.env.NODE_ENV}" mode
`);


function serve_http() {
    const http_port = 80;
    const http_server = http.createServer(Api);
    http_server.on('error', (error: NodeJS.ErrnoException) => console.error(`HTTP system............[ ERROR ]\n--> ${error}\n`));
    http_server.on('listening', () => console.log(`HTTP system............[ OK ]\n\n--> Listening on ${http_port}\n`));
    http_server.listen(http_port);
}


function serve_https() {
    const credentials = {
        key: fs.readFileSync(process.env.PRIV_KEY_FILE, 'utf8'),
        cert: fs.readFileSync(process.env.CERT_FILE, 'utf8'),
        ca: fs.readFileSync(process.env.CHAIN_FILE, 'utf8')
    };
    const https_port = 443;
    const https_server = https.createServer(credentials, Api);
    https_server.on('error', (error: NodeJS.ErrnoException) => console.error(`HTTPS system...........[ ERROR ]\n--> ${error}\n`));
    https_server.on('listening', () => console.log(`HTTPS system...........[ OK ]\n\n--> Listening on ${https_port}\n`));
    https_server.listen(https_port);
}


IPFS.init();

serve_http();

if (process.env.NODE_ENV == 'production') serve_https();

