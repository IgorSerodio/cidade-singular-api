import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

const RewardTypes = {
    "ACCESSORY" : "ACCESSORY",
    "TICKET" : "TICKET",
    "TITLE" : "TITLE",
};

class Mission {

    initSchema() {
        const schema = new Schema({
            city: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'city'
            },
            description: {
                type: String,
                required: true,
            },
            tags: {
                type: [String],
                default: []
            },
            target: {
                type: Number,
                required: true,
            },
            reward: {
                type: String,
                required: true,
            },
            rewardType: {
                type: String,
                enum: Object.keys(RewardTypes),
                required: true,
            }, 
            sponsor: {
                type: mongoose.Types.ObjectId,
                ref: 'user',
            },

        }, { timestamps: true });

        schema.plugin(uniqueValidator);
        mongoose.model('mission', schema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('mission');
    }
}

export default Mission;