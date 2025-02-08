import Controller from './Controller';
import missionServiceInstance from './../services/MissionService';

const missionService = missionServiceInstance;

class MissionController extends Controller {

    constructor(service) {
        super(service);
        this.getMissionByTagsAndCity = this.getMissionByTagsAndCity.bind(this);
        this.getMissionsByIds = this.getMissionsByIds.bind(this);
    }

    async getMissionsByCity(req, res) {
        const { cityId } = req.params;
        let response = await this.service.findByCity(cityId);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(200).send(response);
    }

}

export default new MissionController(missionService);