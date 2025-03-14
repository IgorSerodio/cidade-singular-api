import Service from './Service';

class TitleService extends Service {
    constructor(model, services) {
        super(model);
        this.services = services;
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
    
            const titles = await this.model.find({ _id: { $in: user.titles } });
    
            return {
                error: false,
                statusCode: 200,
                data: titles,
            };
        } catch (error) {
            console.error("Error in findByUser:", error);
            return {
                error: true,
                statusCode: 500,
                message: error.message || "Not able to find titles",
                errors: error.errors,
            };
        }
    }
}

export default TitleService;