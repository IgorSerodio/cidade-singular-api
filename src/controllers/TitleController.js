import Controller from './Controller';
import TitleService from './../services/TitleService';
import Title from './../models/Title';

const titleService = new TitleService(
    new Title().getInstance()
);

class TitleController extends Controller {
    constructor(service) {
        super(service);
    }
}

export default new TitleController(titleService);