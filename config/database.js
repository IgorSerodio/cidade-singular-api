import mongoose from 'mongoose';
import config from 'config';

class Connection {
    constructor() {
        mongoose.connect(config.get('db'))
            .then(() => console.log(`Connected to ${config.get('db')}`))
            .catch(err =>
                console.log(`Error to connect on ${config.get('db')}`, err)
            );
    }
}

export default new Connection();