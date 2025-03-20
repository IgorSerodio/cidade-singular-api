import Controller from './Controller';
import SingularityRequestService from './../services/SingularityRequestService';
import SingularityRequest from './../models/SingularityRequest';
import config from 'config';

import Uploads from '../services/Upload';
import crypto from 'crypto';

const singularityRequestService = new SingularityRequestService(
    new SingularityRequest().getInstance()
);

class SingularityRequestController extends Controller {
    constructor(service) {
        super(service);
        this.getByTypeOrCreator = this.getByTypeOrCreator.bind(this);
    }

    async insert(req, res) {
        if (req.body.photos) {
            const timestamp = Date.now();

            var photos = [];

            await Promise.all(req.body.photos.map((image) => {
                const stamp = crypto
                    .randomBytes(Math.ceil(5 / 2))
                    .toString('hex')
                    .slice(0, 5) + timestamp;
                const filename = req.user.id + stamp + '.jpg';

                photos.push('https://' + config.get('S3_BUCKET') + '.s3.' + config.get('S3_REGION') + '.amazonaws.com/' + config.get('S3_FOLDER') + '/' + filename);
                return Uploads.uploadFile(image, req.user.id, stamp);
            }));

            req.body.photos = photos;
        };
        return super.insert(req, res);
    }

    async update(req, res) {
        if(req.body.newPhotos){
            const timestamp = Date.now();

            var newPhotos = [];

            await Promise.all(req.body.newPhotos.map((image) => {
                const stamp = crypto
                    .randomBytes(Math.ceil(5 / 2))
                    .toString('hex')
                    .slice(0, 5) + timestamp;
                const filename = req.user.id + stamp + '.jpg';

                newPhotos.push('https://' + config.get('S3_BUCKET') + '.s3.' + config.get('S3_REGION') + '.amazonaws.com/' + config.get('S3_FOLDER') + '/' + filename);
                return Uploads.uploadFile(image, req.user.id, stamp);
            }));

            req.body.photos = [...req.body.photos, ...newPhotos];
        }

        return super.update(req, res);
    }

    async getByTypeOrCreator(req, res) {
        const { type, creator } = req.query;

        let response;
        
        if (type) {
            response = await this.service.getByType(type);
        } else if (creator) {
            response = await this.service.getByCreator(creator);
        } else {
            return res.status(400).json({ message: 'No query parameters' });
        }

        return res.status(response.statusCode).send(response);
    }

}

export default new SingularityRequestController(singularityRequestService);