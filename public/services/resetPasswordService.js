"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetPasswordService = void 0;
const models_1 = require("../models");
const dates_1 = require("../utils/dates");
exports.resetPasswordService = {
    create: ({ userId, accessToken, expiresIn }, session) => new models_1.ResetPassword({
        user: userId,
        accessToken,
        expiresIn
    }).save({ session }),
    getByValidAccessToken: (accessToken) => models_1.ResetPassword.findOne({
        accessToken,
        expiresIn: { $gte: (0, dates_1.createDateNow)() }
    }),
    deleteManyByUserId: (userId, session) => models_1.ResetPassword.deleteMany({ user: userId }, { session })
};
