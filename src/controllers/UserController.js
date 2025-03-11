import Controller from './Controller';
import serviceContainer from './../services/ServiceContainer';
import config from 'config';
import crypto from 'crypto';

import Uploads from '../services/Upload';

const { userService } = serviceContainer;

class UserController extends Controller {

    constructor(service) {
        super(service);
        this.createUser = this.createUser.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.recovery = this.recovery.bind(this);
        this.me = this.me.bind(this);
        this.addXp = this.addXp.bind(this);
        this.update = this.update.bind(this);
        this.addMissionsToUser = this.addMissionsToUser.bind(this);
        this.increaseProgress = this.increaseProgress.bind(this);
        this.giveReward = this.giveReward.bind(this);
        this.giveTicketOrTitle = this.giveTicketOrTitle.bind(this);
        this.increaseProgressManually = this.increaseProgressManually.bind(this);
        this.redeemTicket = this.redeemTicket.bind(this);
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

    async addMissionsToUser(req, res) {
        const { id, cityId } = req.params;
        
        let response = await this.service.addMissionsToUser(id, cityId);
        if (response.error) {
            return res.status(response.statusCode).send(response);
        }
        return res.status(200).send(response);
    }

    async increaseProgress(req, res) {
        const { id, cityId } = req.params;
        const { tags, source } = req.body;

        let response = await this.service.increaseProgress(id, cityId, tags, source);
        if (response.error) {
            return res.status(response.statusCode).send(response);
        }
        return res.status(200).send(response);
    }

    async giveReward(req, res) {
        const {id, missionId} = req.params;
        let response = await this.service.giveReward(id, missionId);
        if (response.error) {
            return res.status(response.statusCode).send(response);
        }
        return res.status(200).send(response);
    } 

    async giveTicketOrTitle(req, res) {
        const {email, type, itemId} = req.body;
        let response;
        console.log(type);

        if(type == "ticket") {
            let ticketId = itemId;
            response = await this.service.giveTicket(email, ticketId);
        } else if(type == "title"){
            let titleId = itemId;
            response = await this.service.giveTitle(email, titleId);
        } else {
            return res.status(400).send({ error: true, message: "É necessário fornecer um ticket ou um título." });
        }

        if (response.error) {
            return res.status(response.statusCode).send(response);
        }
        return res.status(200).send(response);
    }

    async increaseProgressManually(req, res){
        const { missionId } = req.params;
        const { email } = req.body;

        let response = await this.service.increaseProgressManually(email, missionId);

        if (response.error) {
            return res.status(response.statusCode).send(response);
        }
        return res.status(200).send(response);
    }

    async redeemTicket(req, res){
        const { ticketId } = req.params;
        const { email } = req.body;

        let response = await this.service.redeemTicket(email, ticketId);

        if (response.error) {
            return res.status(response.statusCode).send(response);
        }
        return res.status(200).send(response);
    }
}

export default new UserController(userService);