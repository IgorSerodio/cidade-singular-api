import Title from './../models/Title';
import Controller from './Controller';
import TitleService from '../services/TitleService';

const  titleService = new TitleService(
    new Title().getInstance()
);

class TitleController extends Controller {

    constructor(service) {
        super(service);
        this.getTitlesByCreator = this.getTitlesByCreator.bind(this);
    }

    async getTitlesByCreator(req, res) {
        const { creatorId } = req.params; 

        let response = await this.service.findByCreator(creatorId);
        if (response.error) return res.status(response.statusCode).send(response);

        return res.status(200).send(response);
    }
}

export default new TitleController(titleService);
