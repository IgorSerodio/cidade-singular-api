import UserService from './../services/UserService';
import { User } from './../models/User';

const userService = new UserService(
    new User().getInstance()
);

class UserController {

    constructor(service) {
        this.service = service;
        this.createUser = this.createUser.bind(this);
        this.authenticate = this.authenticate.bind(this);
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

}

export default new UserController(userService);