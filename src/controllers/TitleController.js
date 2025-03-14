import Controller from './Controller';
import serviceContainer from './../services/ServiceContainer';

const { titleService } = serviceContainer;

class TitleController extends Controller {

    constructor(service) {
        super(service);
        this.getTitlesByCreator = this.getTitlesByCreator.bind(this);
        this.getTitlesByUser = this.getTitlesByUser.bind(this);
    }

    async getTitlesByCreator(req, res) {
        const { creatorId } = req.params; 

        let response = await this.service.findByCreator(creatorId);
        if (response.error) return res.status(response.statusCode).send(response);

        return res.status(200).send(response);
    }

    async getTitlesByUser(req, res) {
        const { userId } = req.params; 

        let response = await this.service.findByUser(userId);
        if (response.error) return res.status(response.statusCode).send(response);

        return res.status(200).send(response);
    }
}

export default new TitleController(titleService);
