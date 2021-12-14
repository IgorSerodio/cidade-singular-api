import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


class City {

    initSchema() {
        const schema = new Schema({
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                required: true,
            },
            picture: {
                type: String,
                required: true,
            },

        }, { timestamps: true });

        schema.plugin(uniqueValidator);
        mongoose.model('city', schema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('city');
    }
}

export default City;