import mongoose, { Schema } from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from 'config';

import { SingularityTypes } from "./Singularity";

const userTypes = {
    'ADMIN': 'ADMIN',
    'MANAGER': 'MANAGER',
    'CURATOR': 'CURATOR',
    'VISITOR': 'VISITOR'
};

class User {

    initSchema() {
        const schema = new Schema({
            email: {
                type: String,
                required: true,
                unique: true,
                match: /.+\@.+\..+/
            },
            name: {
                type: String,
                required: true,
            },
            description: {
                type: String,
                default: ""
            },
            picture: {
                type: String,
                default: ""
            },
            type: {
                type: String,
                enum: Object.keys(userTypes),
                default: userTypes.VISITOR,
            },
            password: {
                type: String,
                required: true
            },
            curator_type: {
                type: String,
                enum: Object.keys(SingularityTypes)
            },
            city: {
                type: mongoose.Types.ObjectId,
                ref: 'city'
            }

        }, { timestamps: true });

        schema.plugin(uniqueValidator);
        schema.methods.comparePassword = async function (candidatePassword) {
            return bcrypt.compare(candidatePassword, this.password);
        };
        schema.methods.generateToken = function () {
            const payload = { id: this._id, type: this.type, city: this.city };
            const token = jwt.sign(payload, config.get('jwtSecret'));

            return token;
        };

        schema.methods.hashPassword = async function (pass) {
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(pass, salt);

            return hash;
        }

        schema.pre("save", function (next) {
            const user = this

            if (this.isModified("password") || this.isNew) {
                bcrypt.genSalt(10, function (saltError, salt) {
                    if (saltError) {
                        return next(saltError)
                    } else {
                        bcrypt.hash(user.password, salt, function (hashError, hash) {
                            if (hashError) {
                                return next(hashError)
                            }

                            user.password = hash
                            next()
                        })
                    }
                })
            } else {
                return next()
            }
        })
        mongoose.model('user', schema);
    }

    getInstance() {
        this.initSchema();
        return mongoose.model('user');
    }
}

export { User, userTypes };