import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

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
        }, { timestamps: true });

        schema.plugin(uniqueValidator);
        mongoose.model('singularity', schema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('singularity');
    }
}

export default Singularity;