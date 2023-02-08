import Controller from './Controller';
import ReviewService from './../services/ReviewService';
import Review from './../models/Review';


const reviewService = new ReviewService(
    new Review().getInstance()
);

class ReviewController extends Controller {

    constructor(service) {
        super(service);
    }

}

export default new ReviewController(reviewService);