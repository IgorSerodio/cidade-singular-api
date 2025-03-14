import SingularityController from './../src/controllers/SingularityController';
import CityController from '../src/controllers/CityController';
import UserController from '../src/controllers/UserController';
import ReviewController from '../src/controllers/ReviewController';
import MissionController from '../src/controllers/MissionController';
import SingularityRequestController from '../src/controllers/SingularityRequestController';
import TitleController from '../src/controllers/TitleController';
import TicketController from '../src/controllers/TicketController';


import UserMiddleware from '../src/middlewares/UserMiddleware';
import { userTypes } from '../src/models/User';

export default (server) => {

    server.get('/', (req, res) => res.send('This API is running, baby!'));
    server.get('/favicon.ico', (req, res) => res.status(204));
    server.get('/favicon.png', (req, res) => res.status(204));

    server.get('/singularity', SingularityController.getAll);
    server.post('/singularity', UserMiddleware.authorize(userTypes.CURATOR), SingularityController.insert)
    server.put('/singularity/:id', UserMiddleware.authorize(userTypes.CURATOR), SingularityController.update);
    server.delete('/singularity/:id', UserMiddleware.authorize(userTypes.CURATOR), SingularityController.delete);

    server.get('/city', CityController.getAll);
    server.get('/city/:id', CityController.getCity);
    server.post('/city', UserMiddleware.authorize(userTypes.ADMIN), CityController.insert)
    server.put('/city/:id', UserMiddleware.authorize(userTypes.ADMIN), CityController.update);
    server.delete('/city/:id', UserMiddleware.authorize(userTypes.ADMIN), CityController.delete);

    server.get('/user', UserController.getAll);
    server.get('/user/me', UserMiddleware.authorize(), UserController.me);
    server.post('/user', UserController.createUser);
    server.post('/user/auth', UserController.authenticate);
    server.put('/user/:id', UserController.update);
    server.delete('/user/:id', UserMiddleware.authorize(userTypes.ADMIN), UserController.delete);
    server.post('/user/recovery/:email', UserController.recovery);
    server.put('/user/addxp/:id', UserController.addXp);
    server.put('/user/:id/add-missions/:cityId', UserMiddleware.authorize(), UserController.addMissionsToUser);
    server.put('/user/:id/increase-progress/:cityId', UserMiddleware.authorize(), UserController.increaseProgress);
    server.put('/user/increase-progress/:missionId', UserMiddleware.authorize(userTypes.ENTREPRENEUR), UserController.increaseProgressManually);
    server.put('/user/:id/reward/:missionId', UserMiddleware.authorize(), UserController.giveReward);
    server.put('/user/give/:itemId', UserMiddleware.authorize(userTypes.ENTREPRENEUR), UserController.giveTicketOrTitle);
    server.put('/user/redeem-ticket/:ticketId', UserMiddleware.authorize(userTypes.ENTREPRENEUR), UserController.redeemTicket);

    server.get('/review', ReviewController.getAll);
    server.post('/review', ReviewController.insert)
    server.put('/review/:id', ReviewController.update);
    server.delete('/review/:id', ReviewController.delete);

    server.get('/mission', MissionController.getAll);
    server.get('/mission/city/:cityId', MissionController.getMissionsByCity);
    server.get('/mission/sponsor/:sponsor', MissionController.getMissionsBySponsor);
    server.post('/mission', UserMiddleware.authorize(userTypes.ENTREPRENEUR), MissionController.insert);
    server.put('/mission/:id', UserMiddleware.authorize(userTypes.ENTREPRENEUR), MissionController.update);
    server.delete('/mission/:id', UserMiddleware.authorize(userTypes.ENTREPRENEUR), MissionController.delete);

    server.get('/singularity-request/filter', UserMiddleware.authorize(userTypes.ENTREPRENEUR), SingularityRequestController.getByTypeOrCreator);
    server.post('/singularity-request/', UserMiddleware.authorize(), SingularityRequestController.insert);
    server.put('/singularity-request/:id', UserMiddleware.authorize(userTypes.ENTREPRENEUR), SingularityRequestController.update);
    server.delete('/singularity-request/:id', UserMiddleware.authorize(userTypes.ENTREPRENEUR), SingularityRequestController.delete);

    server.get('/title/:creatorId', TitleController.getTitlesByCreator);
    server.get('/title/user/:userId', TitleController.getTitlesByUser);
    server.post('/title', UserMiddleware.authorize(userTypes.ENTREPRENEUR), TitleController.insert);
    server.put('/title/:id', UserMiddleware.authorize(userTypes.ENTREPRENEUR), TitleController.update);
    server.delete('/title/:id', UserMiddleware.authorize(userTypes.ENTREPRENEUR), TitleController.delete);

    server.get('/ticket/:creatorId', TicketController.getTicketsByCreator);
    server.get('/ticket/user/:userId', TicketController.getTicketsByUser);
    server.post('/ticket', UserMiddleware.authorize(userTypes.ENTREPRENEUR), TicketController.insert);
    server.put('/ticket/:id', UserMiddleware.authorize(userTypes.ENTREPRENEUR), TicketController.update);
    server.delete('/ticket/:id', UserMiddleware.authorize(userTypes.ENTREPRENEUR), TicketController.delete);
}