import Controller from './Controller';
import TicketService from './../services/TicketService';
import Ticket from './../models/Ticket';

const ticketService = new TicketService(
    new Ticket().getInstance()
);

class TicketController extends Controller {
    constructor(service) {
        super(service);
    }
}

export default new TicketController(ticketService);
