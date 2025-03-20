import Controller from './Controller';
import SingularityService from './../services/SingularityService';
import { Singularity } from './../models/Singularity';
import config from 'config';

import Uploads from '../services/Upload';
import crypto from 'crypto';

const singularityService = new SingularityService(
    new Singularity().getInstance()
);

class SingularityController extends Controller {

    constructor(service) {
        super(service);
    }

    async insert(req, res) {
        const {fromRequest} = req.query;
        if (req.body.photos && !req.query) {
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
}

export default new SingularityController(singularityService);