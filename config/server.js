import express from 'express';
import bodyParser from 'body-parser';
import morganBody from 'morgan-body';
import setRoutes from './routes';

const cors = require('cors');
const server = express();

server.use(cors());
server.use(bodyParser.json({ limit: '50mb' }));
morganBody(server, { logAllReqHeader: true, maxBodyLength: 5000 });

setRoutes(server);

export default server;