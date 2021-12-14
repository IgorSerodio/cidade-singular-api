import './config/database';
import server from './config/server';
import config from 'config';

const PORT = config.get('port') || 3000;

server.listen(PORT, () => {
    console.log(`app running on port ${PORT}`);
});