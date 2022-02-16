import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';


class City {

    initSchema() {
        const schema = new Schema({
            title: {
                type: String,
                required: true,
                unique: true,
            },
            blazon: String,
            subtitle: String,
            description: {
                type: String,
                required: true,
            },
            pictures: {
                type: [String],
                default: []
            },
            lat: Number,
            lng: Number

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