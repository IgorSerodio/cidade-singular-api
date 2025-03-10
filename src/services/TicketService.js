import Service from './Service';

class TicketService extends Service {
    constructor(model) {
        super(model);
    }

    async findByCreator(creatorId) {
        try {
            const tickets = await this.model.find({ creator: creatorId });

            return {
                error: false,
                statusCode: 200,
                data: tickets
            };
        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.message || 'Not able to find tickets',
                errors: error.errors
            };
        }
    }
}

export default TicketService;