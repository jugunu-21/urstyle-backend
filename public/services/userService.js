"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const models_1 = require("../models");
exports.userService = {
    create: ({ phone_number, verified = false }, session) => new models_1.User({
        phone_number,
        verified
    }).save({ session }),
    getById: (userId) => models_1.User.findById(userId),
    getByEmail: (email) => models_1.User.findOne({ email }),
    getByphone_number: (phone_number) => models_1.User.findOne({ phone_number }),
    isExistByphone_number: (phone_number) => models_1.User.exists({ phone_number }),
    updatePasswordByUserId: (userId, password, session) => {
        const data = [{ _id: userId }, { password, resetPasswords: [] }];
        let params = null;
        if (session) {
            params = [...data, { session }];
        }
        else {
            params = data;
        }
        return models_1.User.updateOne(...params);
    },
    updateProfileByUserId: (userId, { firstName, lastName }, session) => {
        const data = [{ _id: userId }, { firstName, lastName }];
        let params = null;
        if (session) {
            params = [...data, { session }];
        }
        else {
            params = data;
        }
        return models_1.User.updateOne(...params);
    },
    deleteById: (userId, session) => models_1.User.deleteOne({ _id: userId }, { session }),
    addVerificationToUser: async ({ userId, verificationId }, session) => {
        let options = {};
        if (session) {
            options = { session };
        }
        const user = await models_1.User.findOne({ _id: userId }, null, options);
        if (user) {
            if (!user.verifications) {
                user.verifications = [];
            }
            user.verifications.push(verificationId);
            await user.save({ session });
        }
    }
};
