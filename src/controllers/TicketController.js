import Ticket from './../models/Ticket';
import TicketService from '../services/TicketService';
import Controller from './Controller';

const ticketService = new TicketService(
    new Ticket().getInstance()
);

class TicketController extends Controller {

    constructor(service) {
        super(service);
        this.getTicketsByCreator = this.getTicketsByCreator.bind(this);
    }

    async getTicketsByCreator(req, res) {
        const { creatorId } = req.params;

        let response = await this.service.findByCreator(creatorId);
        if (response.error) return res.status(response.statusCode).send(response);

        return res.status(200).send(response);
    }
}

export default new TicketController(ticketService);
