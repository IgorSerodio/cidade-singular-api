import UserService from './UserService';
import MissionService from './MissionService';
import {User} from './../models/User';
import Mission from './../models/Mission';

class ServiceContainer {
    constructor() {
        this.userService = new UserService(new User().getInstance(), this);
        this.missionService = new MissionService(new Mission().getInstance(), this);
    }
}

export default new ServiceContainer();