import express from 'express';
import bodyParser from 'body-parser';
import morganBody from 'morgan-body';
import setRoutes from './routes';

const server = express();

server.use(bodyParser.json());
morganBody(server, { logAllReqHeader: true, maxBodyLength: 5000 });

setRoutes(server);

export default server;