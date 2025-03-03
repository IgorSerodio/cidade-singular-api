import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';

class Title {
    initSchema() {
        const schema = new Schema({
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                default: "",
            },
            creator: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'user',
            },
        }, { timestamps: true });

        schema.plugin(uniqueValidator);
        mongoose.model('title', schema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('title');
    }
}