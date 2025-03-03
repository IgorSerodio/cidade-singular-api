import Service from './Service';

class MissionService extends Service {
    constructor(model, services) {
        super(model);
        this.services = services;
    }

    async delete(id) {
        try {
            await this.services.userService.removeMissionProgress(id);
            
            let item = await this.model.findByIdAndDelete(id);
            if (!item) {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'Mission not found',
                };
            }

            return {
                error: false,
                deleted: true,
                statusCode: 204,
            };
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                error,
            };
        }
    }

    async findById(id) {
        try {
            let mission = await this.model.findById(id);
            if (mission) {
                return { error: false, mission};
            } else {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'mission not found.'
                }
            }

        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || 'Not able to find mission',
                errors: error.errors
            };
        }
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
                tags: {
                    $not: {
                        $elemMatch: {
                            $nin: tags
                        }
                    }
                }
            });

            if (missions.length > 0) {
                const missionIdList = missions.map(mission => mission._id);

                return {
                    error: false,
                    statusCode: 200,
                    missionIdList
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

    async findByCity(cityId) {
        try {
            if (!cityId) {
                return {
                    error: true,
                    statusCode: 400,
                    message: 'City ID is required.'
                };
            }

            const missions = await this.model.find({
                city: cityId,
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
                    message: 'No missions found with the provided city.'
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