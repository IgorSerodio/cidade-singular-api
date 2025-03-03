import Controller from './Controller';
import SingularityRequestService from './../services/SingularityRequestService';
import SingularityRequest from './../models/SingularityRequest';

const singularityRequestService = new SingularityRequestService(
    new SingularityRequest().getInstance()
);

class SingularityRequestController extends Controller {
    constructor(service) {
        super(service);
        this.getByType = this.getByType.bind(this);
    }

    async getByType(req, res) {
        const { type } = req.params;

        let response = await this.service.getByType(type);
        return res.status(response.statusCode).send(response);
    }
}

export default new SingularityRequestController(singularityRequestService);
