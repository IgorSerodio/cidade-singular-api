import UserController from '../src/controllers/UserController';

export default (server) => {

    server.get('/', (req, res) => res.send('This API is running, baby!'));

    server.post('/user', UserController.createUser);
    server.post('/user/auth', UserController.authenticate);

}