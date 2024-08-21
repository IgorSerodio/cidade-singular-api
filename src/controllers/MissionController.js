import Controller from './Controller';
import MissionService from './../services/MissionService';
import Mission from './../models/Mission';

const missionService = new MissionService(
    new Mission().getInstance()
);

class MissionController extends Controller {

    constructor(service) {
        super(service);
        this.getMissionByTagsAndCity = this.getMissionByTagsAndCity.bind(this);
        this.getMissionsByIds = this.getMissionsByIds.bind(this);
    }

    async getMissionByTagsAndCity(req, res) {
        const { tags, cityId } = req.body;
        let response = await this.service.findByTagsAndCity(tags, cityId);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(200).send(response);
    }

    async getMissionsByIds(req, res) {
        const { ids } = req.body;
        let response = await this.service.findByIds(ids);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(200).send(response);
    }

}

export default new MissionController(missionService);