import Service from './Service';

class CityService extends Service {
    constructor(model) {
        super(model);
    }

    async findById(id) {
        try {
            let city = await this.model.findById(id);
            if (city) {
                return { error: false, city };
            } else {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'city not found.'
                }
            }

        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || 'Not able to find city',
                errors: error.errors
            };
        }
    }
};

export default CityService;