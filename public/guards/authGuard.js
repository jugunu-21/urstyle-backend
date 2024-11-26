"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authGuard = void 0;
const http_status_codes_1 = require("http-status-codes");
exports.authGuard = {
    isAuth: ({ context: { user } }, res, next) => {
        if (user) {
            return next();
        }
        return res.status(http_status_codes_1.StatusCodes.UNAUTHORIZED).json({
            message: http_status_codes_1.ReasonPhrases.UNAUTHORIZED,
            status: http_status_codes_1.StatusCodes.UNAUTHORIZED
        });
    },
    isGuest: ({ context: { user } }, res, next) => {
        if (!user) {
            return next();
        }
        return res.status(http_status_codes_1.StatusCodes.FORBIDDEN).json({
            message: http_status_codes_1.ReasonPhrases.FORBIDDEN,
            status: http_status_codes_1.StatusCodes.FORBIDDEN
        });
    }
};
