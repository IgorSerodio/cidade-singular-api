import jwt from "jsonwebtoken";
import { userTypes } from "../models/User";
import config from "config";

class UserMiddleware {

    authorize(authorizationLevel) {
        return (req, res, next) => {
            let token = req.header("Authorization");

            if (!token)
                return res.status(401).send({
                    error: true,
                    statusCode: 401,
                    error: "Access denied. No token provided."
                });

            if (token.split(" ").length < 2)
                return res.status(401).send({
                    error: true,
                    statusCode: 401,
                    error: "Invalid token, rember to put the Bearer prefix"
                });

            token = token.split(" ")[1];

            try {
                req.user = jwt.verify(token, config.get("jwtSecret"));
            } catch (error) {
                return res.status(401).send({
                    error: true,
                    statusCode: 401,
                    error: "Invalid token"
                });
            }

            if (authorizationLevel && !this.checkAuthorizationLevel(authorizationLevel, req.user.type)) {
                return res.status(401).send({
                    error: true,
                    statusCode: 401,
                    error: "You do not have the permission level required to access this feature."
                });
            }
            next();
        }
    }

    checkAuthorizationLevel(authorizationLevel, userType) {
        let result = false;

        switch (authorizationLevel) {
            case userTypes.ADMIN:
                result = userType === userTypes.ADMIN;
                break;
            case userTypes.MANAGER:
                result = userType === userTypes.ADMIN || userType === userTypes.MANAGER;
                break;
            case userTypes.CURATOR:
                result = userType === userTypes.ADMIN || userType === userTypes.MANAGER || userType === userTypes.CURATOR;
                break;
            case userTypes.VISITOR:
                result = true;
        }
        return result;
    }

}

export default new UserMiddleware();