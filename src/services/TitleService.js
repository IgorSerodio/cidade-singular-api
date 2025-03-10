import Service from './Service';

class TitleService extends Service {
    constructor(model) {
        super(model);
    }

    async findByCreator(creatorId) {
        try {
            const titles = await this.model.find({ creator: creatorId });

            return {
                error: false,
                statusCode: 200,
                data: titles
            };
        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.message || 'Not able to find titles',
                errors: error.errors
            };
        }
    }

}

export default TitleService;