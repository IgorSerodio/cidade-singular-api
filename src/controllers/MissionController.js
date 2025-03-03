import Controller from './Controller';
import serviceContainer from './../services/ServiceContainer';

const { missionService } = serviceContainer;

class MissionController extends Controller {

    constructor(service) {
        super(service);
        this.getMissionsByCity = this.getMissionsByCity.bind(this);
    }

    async getMissionsByCity(req, res) {
        const { cityId } = req.params;
        let response = await this.service.findByCity(cityId);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(200).send(response);
    }

}

export default new MissionController(missionService);