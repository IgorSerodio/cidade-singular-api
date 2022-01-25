import UserService from './../services/UserService';
import Controller from './Controller';
import { User } from './../models/User';

const userService = new UserService(
    new User().getInstance()
);

class UserController extends Controller {

    constructor(service) {
        super(service);
        this.createUser = this.createUser.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.me = this.me.bind(this);

    }

    async createUser(req, res) {
        let response = await this.service.createUser(req.body);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(201).send(response);
    }

    async authenticate(req, res) {
        let { email, password } = req.body;
        let response = await this.service.authenticate(email, password);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(201).send(response);
    }

    async me(req, res) {
        let response = await this.service.findById(req.user.id);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(201).send(response);
    }

}

export default new UserController(userService);