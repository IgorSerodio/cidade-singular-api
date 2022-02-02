import Service from './Service';
import bcrypt from 'bcrypt';

class UserService extends Service {
    constructor(model) {
        super(model);
    }

    async getAll(query) {
        let { skip, limit } = query;
        let paginate = false;
        if (skip && limit) {
            paginate = true;
            skip = skip ? Number(skip) : 0;
            limit = limit ? Number(limit) : 10;

        }

        delete query.skip;
        delete query.limit;

        if (query._id) {
            try {
                query._id = new mongoose.mongo.ObjectId(query._id);
            } catch (error) {
                console.log('not able to generate mongoose id with content', query._id);
            }
        }

        try {

            let items = []

            if (paginate) {
                items = await this.model
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .populate('city');
            } else {
                items = await this.model
                    .find(query)
                    .populate('city');
            }



            let total = await this.model.count();

            return {
                error: false,
                statusCode: 200,
                data: items,
                total
            };
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                errors
            };
        }
    }


    async findById(id) {
        try {
            let user = await this.model.findById(id).populate('city');
            if (user) {
                return { error: false, user };
            } else {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'user not found.'
                }
            }

        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || 'Not able to find user',
                errors: error.errors
            };
        }
    }

    async createUser(data) {
        try {
            let user = await this.model.create(data);
            if (user) {
                return { error: false, user };
            }

        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || 'Not able to create user',
                errors: error.errors
            };
        }
    }

    async update(id, data) {
        try {
            let item = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('city');
            return {
                error: false,
                statusCode: 202,
                item
            };
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                error
            };
        }
    }

    async authenticate(email, password) {

        try {
            let user = await this.model.findOne({ 'email': email });
            if (!user) {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'user not found.'
                };
            }

            if (! await user.comparePassword(password)) {
                return {
                    error: true,
                    statusCode: 401,
                    message: 'incorrect password.'
                };
            }
            if (user) {
                return { error: false, user, token: user.generateToken() };
            }

        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || 'Not able to authenticate user',
                errors: error.errors
            };
        }
    }
}

export default UserService;