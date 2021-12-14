import Service from './Service';
import bcrypt from 'bcrypt';

class UserService extends Service {
    constructor(model) {
        super(model);
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