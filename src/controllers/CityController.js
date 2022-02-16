import Controller from './Controller';
import CityService from './../services/CityService';
import City from './../models/City';

const cityService = new CityService(
    new City().getInstance()
);

class CityController extends Controller {

    constructor(service) {
        super(service);
        this.getCity = this.getCity.bind(this);
    }

    async getCity(req, res) {
        const { id } = req.params;
        let response = await this.service.findById(id);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(201).send(response);
    }

}

export default new CityController(cityService);