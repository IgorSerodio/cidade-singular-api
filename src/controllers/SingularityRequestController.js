import Controller from './Controller';
import SingularityRequestService from './../services/SingularityRequestService';
import SingularityRequest from './../models/SingularityRequest';

const singularityRequestService = new SingularityRequestService(
    new SingularityRequest().getInstance()
);

class SingularityRequestController extends Controller {
    constructor(service) {
        super(service);
        this.getByType = this.getByTypeOrCreator.bind(this);
    }

    async getByTypeOrCreator(req, res) {
        const { type, creator } = req.query;

        let response;
        
        if (type) {
        response = await SingularityRequestService.getByType(type);
        } else if (creator) {
        response = await SingularityRequestService.getByCreator(creator);
        } else {
            return res.status(400).json({ message: 'No query parameters' });
        }

        return res.status(response.statusCode).send(response);
    }

}

export default new SingularityRequestController(singularityRequestService);
