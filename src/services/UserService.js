import Service from './Service';
import bcrypt from 'bcrypt';
import MailService from './MailService';
import missionServiceInstance from './MissionService';

const missionService = missionServiceInstance;

class UserService extends Service {
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
                    .populate('city');
            } else {
                items = await this.model
                    .find(query)
                    .populate('city');
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


    async findById(id) {
        try {
            let user = await this.model.findById(id).populate('city');
            if (user) {
                return { error: false, user };
            } else {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'user not found.'
                }
            }

        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || 'Not able to find user',
                errors: error.errors
            };
        }
    }

    async createUser(data) {
        try {
            let user = await this.model.create(data);
            if (user) {
                return { error: false, user };
            }

        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || 'Not able to create user',
                errors: error.errors
            };
        }
    }

    async update(id, data) {
        try {
            let item = await this.model.findByIdAndUpdate(id, data, { new: true, runValidators: true }).populate('city');
            return {
                error: false,
                statusCode: 202,
                item
            };
        } catch (error) {
            return {
                error: true,
                statusCode: 500,
                error
            };
        }
    }

    async addMissionsToUser(id, cityId){
        try {
            if (!id) {
                return {
                    error: true,
                    statusCode: 400,
                    message: 'User ID is required.'
                };
            }

            let user = await this.model.findById(id);

            if (!cityId) {
                return {
                    error: true,
                    statusCode: 400,
                    message: 'City ID is required.'
                };
            }

            const missions = await missionService.findByCity(cityId);

            const newMissions = missions.filter(mission => 
                !user.progress.some(progress => 
                    progress.missionId.equals(mission._id)
                )
            );
    
            for (const mission of newMissions) {
                user.progress.push({ missionId: mission._id, value: 0 });
            }

            return this.update(id, user);

        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.message || 'Not able to add missions to user',
                errors: error.errors
            };
        }
    }

    async increaseProgress(id, cityId, tags){
        try {
            const missionResponse = await missionService.findByTagsAndCity(tags, cityId);
            if (missionResponse.error) {
                return {
                    error: true,
                    statusCode: missionResponse.statusCode,
                    message: missionResponse.message
                };
            }

            const missionIdList = missionResponse.missionIdList;

            if (!id) {
                return {
                    error: true,
                    statusCode: 400,
                    message: 'User ID is required.'
                };
            }

            let user = await this.model.findById(id);

            for(missionId of missionIdList){
                if(!user.progress.some(progress => 
                    progress.missionId.equals(missionId)
                )){
                    return {
                        error: true,
                        statusCode: 500,
                        message: 'One or more invalid mission ids provided.'
                    };
                }
            }

            user.progress = user.progress.map(progress => {
                if (missionIdList.includes(progress.missionId)) {
                    progress.value += 1;  
                }
                return progress;
            });
    
            return this.update(id, user);

        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.message || 'Not able to increase user mission progress',
                errors: error.errors
            };
        }
    }

    async authenticate(email, password) {

        try {
            let user = await this.model.findOne({ 'email': email });
            if (!user) {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'user not found.'
                };
            }

            if (! await user.comparePassword(password)) {
                return {
                    error: true,
                    statusCode: 401,
                    message: 'incorrect password.'
                };
            }
            if (user) {
                return { error: false, user, token: user.generateToken() };
            }

        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || 'Not able to authenticate user',
                errors: error.errors
            };
        }
    }

    async recovery(email, newPassword) {

        try {
            let user = await this.model.findOne({ 'email': email });
            if (!user) {
                return {
                    error: true,
                    statusCode: 404,
                    message: 'user not found.'
                };
            }
            let pass = await user.hashPassword(newPassword);

            await this.model.findByIdAndUpdate(user._id, { password: pass }, { new: true, runValidators: true });

            MailService.sendMail(email, "Cidade Singular - Recuperação de senha",
                `Sua nova senha é
                <h1><b>${newPassword}</b></h1><br>
                Recomendamos alterar a senha assim que entrar no aplicativo, nas configurações de perfil.<br><br>
                --<br>
                Atenciosamente,<br>
                Equipe Compcult
                `
            );

            return { error: false, emailSent: true };


        } catch (error) {
            console.log('error', error);
            return {
                error: true,
                statusCode: 500,
                message: error.errmsg || 'Not able to recovery password',
                errors: error.errors
            };
        }
    }
}

export default UserService;