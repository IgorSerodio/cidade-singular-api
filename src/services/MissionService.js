import Service from './Service';

class MissionService extends Service {
    constructor(model) {
        super(model);
    }

    async findByTags(tags) {
        try {
            if (!Array.isArray(tags) || tags.length === 0) {
                return {
                    error: true,
                    statusCode: 400,
                    message: 'Tags should be a non-empty array.'
                };
            }

            const missions = await this.model.find({
                tags: { $in: tags }
            });

            if (missions.length > 0) {
                return {
                    error: false,
                    statusCode: 200,
                    data: missions
                };
            } else {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'No missions found with the provided tags.'
                };
            }
        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.message || 'Not able to find missions',
                errors: error.errors
            };
        }
    }
}

export default MissionService;