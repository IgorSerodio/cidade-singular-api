import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


class Review {

    initSchema() {
        const schema = new Schema({
            creator: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'user'
            },
            singularity: {
                type: mongoose.Types.ObjectId,
                required: true,
                ref: 'singularity'
            },
            comment: {
                type: String,
                required: true,
            },
            rating: {
                type: Number,
                required: true,
            },
        }, { timestamps: true });

        schema.plugin(uniqueValidator);
        mongoose.model('review', schema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('review');
    }
}

export default Review;