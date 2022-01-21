import SingularityController from './../src/controllers/SingularityController';
import CityController from '../src/controllers/CityController';
import UserController from '../src/controllers/UserController';
import UserMiddleware from '../src/middlewares/UserMiddleware';
import { userTypes } from '../src/models/User';

export default (server) => {

    server.get('/', (req, res) => res.send('This API is running, baby!'));

    server.get('/singularity', SingularityController.getAll);
    server.post('/singularity', UserMiddleware.authorize(userTypes.CURATOR), SingularityController.insert)
    server.put('/singularity/:id', UserMiddleware.authorize(userTypes.CURATOR), SingularityController.update);
    server.delete('/singularity/:id', UserMiddleware.authorize(userTypes.CURATOR), SingularityController.delete);

    server.get('/city', CityController.getAll);
    server.post('/city', UserMiddleware.authorize(userTypes.ADMIN), CityController.insert)
    server.put('/city/:id', UserMiddleware.authorize(userTypes.ADMIN), CityController.update);
    server.delete('/city/:id', UserMiddleware.authorize(userTypes.ADMIN), CityController.delete);


    server.get('/user', UserController.getAll);
    server.post('/user', UserController.createUser);
    server.post('/user/auth', UserController.authenticate);
    server.put('/user/:id', UserController.update);
    server.delete('/user/:id', UserMiddleware.authorize(userTypes.ADMIN), UserController.delete);

}