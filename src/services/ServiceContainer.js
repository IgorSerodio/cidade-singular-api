import UserService from './UserService';
import MissionService from './MissionService';
import {User} from './../models/User';
import Mission from './../models/Mission';

class ServiceContainer {
    constructor() {
        this.userService = new UserService(User);
        this.missionService = new MissionService(Mission);

        this.userService.setMissionService(this.missionService);
        this.missionService.setUserService(this.userService);
    }
}

export default new ServiceContainer();