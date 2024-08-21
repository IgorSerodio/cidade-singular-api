import Service from './Service';

class MissionService extends Service {
    constructor(model) {
        super(model);
    }

    async findByTagsAndCity(tags, cityId) {
        try {
            if (!Array.isArray(tags) || tags.length === 0) {
                return {
                    error: true,
                    statusCode: 400,
                    message: 'Tags should be a non-empty array.'
                };
            }

            if (!cityId) {
                return {
                    error: true,
                    statusCode: 400,
                    message: 'City ID is required.'
                };
            }

            const missions = await this.model.find({
                city: cityId,
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
                    message: 'No missions found with the provided tags and city.'
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