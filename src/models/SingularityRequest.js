import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

import { SingularityTypes } from "./Singularity";

class SingularityRequest {

    initSchema() {
        const schema = new Schema({
            visitingHours: {
                type: String,
                required: true,
            },
            title: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            address: {
                type: String,
                required: true,
            },
            photos: {
                type: [String],
                default: []
            },
            creator: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'user'
            },
            type: {
                type: String,
                enum: Object.keys(SingularityTypes),
                required: true
            },
            city: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'city'
            },
            tags: {
                type: [String],
                default: []
            },
            maturity: {
                type: Number,
                default: 0,
            },
            email: {
                type: String,
                required: false,
            },
            phone: {
                type: String,
                required: false,
            }
        }, { timestamps: true });

        schema.plugin(uniqueValidator);
        mongoose.model('singularity_request', schema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('singularity_request');
    }
}

export default SingularityRequest;