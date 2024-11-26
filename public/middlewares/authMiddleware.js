"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const headers_1 = require("../utils/headers");
const jwt_1 = require("../utils/jwt");
const services_1 = require("../services");
const authMiddleware = async (req, _, next) => {
    try {
        Object.assign(req, { context: {} });
        const { accessToken } = (0, headers_1.getAccessTokenFromHeaders)(req.headers);
        if (!accessToken)
            return next();
        const { id } = (0, jwt_1.jwtVerify)({ accessToken });
        if (!id)
            return next();
        const user = await services_1.userService.getById(id);
        if (!user)
            return next();
        Object.assign(req, {
            context: {
                user,
                accessToken
            }
        });
        return next();
    }
    catch (error) {
        return next();
    }
};
exports.authMiddleware = authMiddleware;
