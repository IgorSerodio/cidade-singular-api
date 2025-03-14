import UserService from './UserService';
import MissionService from './MissionService';
import {User} from './../models/User';
import Mission from './../models/Mission';
import TicketService from './TicketService';
import Ticket from '../models/Ticket';
import TitleService from './TitleService';
import Title from '../models/Title';

class ServiceContainer {
    constructor() {
        this.userService = new UserService(new User().getInstance(), this);
        this.missionService = new MissionService(new Mission().getInstance(), this);
        this.ticketService = new TicketService(new Ticket().getInstance(), this);
        this.titleService = new TitleService(new Title().getInstance(), this);
    }
}

export default new ServiceContainer();