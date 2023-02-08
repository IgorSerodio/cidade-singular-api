import UserService from './../services/UserService';
import Controller from './Controller';
import { User } from './../models/User';
import config from 'config';
import crypto from 'crypto';

import Uploads from '../services/Upload';

const userService = new UserService(
    new User().getInstance()
);

class UserController extends Controller {

    constructor(service) {
        super(service);
        this.createUser = this.createUser.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.recovery = this.recovery.bind(this);
        this.me = this.me.bind(this);
        this.addXp = this.addXp.bind(this);
        this.update = this.update.bind(this);
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

    async update(req, res) {
        if (req.body.picture) {
            const { id } = req.params;
            const timestamp = Date.now();
            const stamp = crypto
                .randomBytes(Math.ceil(5 / 2))
                .toString('hex')
                .slice(0, 5) + timestamp;
            const filename = id + stamp + '.jpg';
            await Uploads.uploadFile(req.body.picture, id, stamp);
            req.body.picture = 'https://' + config.get('S3_BUCKET') + '.s3.' + config.get('S3_REGION') + '.amazonaws.com/' + config.get('S3_FOLDER') + '/' + filename;
        };

        return super.update(req, res);
    }

    async recovery(req, res) {
        let { email } = req.params;
        let newPassword = crypto.randomBytes(4).toString('hex').slice(0, 4);
        let response = await this.service.recovery(email, newPassword);
        if (response.error) return res.status(response.statusCode).send(response);
        return res.status(201).send(response);
    }

    async addXp(req, res){
        const { id } = req.params;

        let response = await this.service.findById(id);
        let userPoints = response.user.xp;
        
        req.body.xp = req.body.xp += userPoints;
        return super.update(req, res);
    }
}

export default new UserController(userService);