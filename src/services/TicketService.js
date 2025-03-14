import Service from './Service';

class TicketService extends Service {
    constructor(model, services) {
        super(model);
        this.services = services
    }

    async findByCreator(creatorId) {
        try {
            if(!creatorId){
                return {
                    error: true,
                    statusCode: 400,
                    message: 'Creator Id is required.',
                };
            }

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

    async findByUser(userId) {
        try {
            if (!userId) {
                return {
                    error: true,
                    statusCode: 400,
                    message: "User ID is required.",
                };
            }
    
            const user = (await this.services.userService.findById(userId)).user;
            if (!user) {
                return {
                    error: true,
                    statusCode: 404,
                    message: "User not found.",
                };
            }

            console.log(user.tickets);
    
            const ticketIds = user.tickets?.map(ticket => ticket.ticketId);

            const tickets = await this.model.find({ _id: { $in: ticketIds } });
    
            return {
                error: false,
                statusCode: 200,
                data: tickets,
            };
        } catch (error) {
            console.error("Error in findByUser:", error);
            return {
                error: true,
                statusCode: 500,
                message: error.message || "Not able to find tickets",
                errors: error.errors,
            };
        }
    }
}

export default TicketService;