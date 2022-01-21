import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const SingularityTypes = {
    "ARTS": "ARTS",
    "CRAFTS": "CRAFTS",
    "FILM": "FILM",
    "DESIGN": "DESIGN",
    "GASTRONOMY": "GASTRONOMY",
    "LITERATURE": "LITERATURE",
    "MUSIC": "MUSIC"
};

class Singularity {

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
            city: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'city'
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
            }
        }, { timestamps: true });

        schema.plugin(uniqueValidator);
        mongoose.model('singularity', schema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('singularity');
    }
}

export { Singularity, SingularityTypes };