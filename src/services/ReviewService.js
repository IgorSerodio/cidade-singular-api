import Service from './Service';

class ReviewService extends Service {
    constructor(model) {
        super(model);
    }

    async getAll(query) {
        let { skip, limit } = query;

        let paginate = false;
        if (skip && limit) {
            paginate = true;
            skip = skip ? Number(skip) : 0;
            limit = limit ? Number(limit) : 10;
        }

        delete query.skip;
        delete query.limit;

        if (query._id) {
            try {
                query._id = new mongoose.mongo.ObjectId(query._id);
            } catch (error) {
                console.log('not able to generate mongoose id with content', query._id);
            }
        }

        try {

            let items = []

            if (paginate) {
                items = await this.model
                    .find(query)
                    .skip(skip)
                    .limit(limit)
                    .populate('singularity')
                    .populate('creator');
            } else {
                items = await this.model
                    .find(query)
                    .sort({'updatedAt': 'desc'})
                    .populate('singularity')
                    .populate('creator');
            }
            let total = await this.model.count();

            return {
                error: false,
                statusCode: 200,
                data: items,
                total
            };
        } catch (errors) {
            return {
                error: true,
                statusCode: 500,
                errors
            };
        }
    }
};

export default ReviewService;