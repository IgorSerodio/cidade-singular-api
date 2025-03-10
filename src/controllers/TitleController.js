import Controller from './Controller';
import serviceContainer from './../services/ServiceContainer';

const { titleService } = serviceContainer;

class TitleController extends Controller {

    constructor(service) {
        super(service);
        this.getTitlesByCreator = this.getTitlesByCreator.bind(this);
    }

    async getTitlesByCreator(req, res) {
        const { creatorId } = req.params; 

        let response = await this.service.findByCreator(creatorId);
        if (response.error) return res.status(response.statusCode).send(response);
    }
}

export default new TitleController(titleService);
