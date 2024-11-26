"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificationService = void 0;
const models_1 = require("../models");
const dates_1 = require("../utils/dates");
exports.verificationService = {
    create: ({ userId, accessToken, expiresIn }, session) => new models_1.Verification({
        user: userId,
        accessToken,
        expiresIn
    }).save({ session }),
    getByValidAccessToken: (accessToken) => models_1.Verification.findOne({
        accessToken,
        expiresIn: { $gte: (0, dates_1.createDateNow)() }
    }),
    deleteManyByUserId: (userId, session) => models_1.Verification.deleteMany({ user: userId }, { session })
};
