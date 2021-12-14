import Controller from './Controller';
import SingularityService from './../services/SingularityService';
import Singularity from './../models/Singularity';

const singularityService = new SingularityService(
    new Singularity().getInstance()
);

class SingularityController extends Controller {

    constructor(service) {
        super(service);
    }

    async insert(req, res) {
        req.body.creator = req.user.id;
        return super.insert(req, res);
    }

}

export default new SingularityController(singularityService);