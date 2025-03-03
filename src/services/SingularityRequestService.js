import Service from './Service';

class SingularityRequestService extends Service {
    constructor(model) {
        super(model);
    }

    async getByType(type) {
        try {
            const items = await this.model.find({ type });

            return {
                error: false,
                statusCode: 200,
                data: items,
            };
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                message: 'Error fetching singularity requests by type',
                errors: error,
            };
        }
    }
}

export default SingularityRequestService;