import Controller from './Controller';
import CityService from './../services/CityService';
import City from './../models/City';

const cityService = new CityService(
    new City().getInstance()
);

class CityController extends Controller {

    constructor(service) {
        super(service);
    }

}

export default new CityController(cityService);