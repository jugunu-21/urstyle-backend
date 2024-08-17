"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const mongoose_1 = require("mongoose");
const http_status_codes_1 = require("http-status-codes");
const winston_1 = __importDefault(require("winston"));
const services_1 = require("../services");
exports.userController = {
    me: async ({ context: { user } }, res) => {
        if (!user) {
            return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                message: http_status_codes_1.ReasonPhrases.NOT_FOUND,
                status: http_status_codes_1.StatusCodes.NOT_FOUND
            });
        }
        return res.status(http_status_codes_1.StatusCodes.OK).json({
            data: { ...user.toJSON() },
            message: http_status_codes_1.ReasonPhrases.OK,
            status: http_status_codes_1.StatusCodes.OK
        });
    },
    deleteProfile: async ({ context: { user: { id, phone_number }, }, body: { phone_number: bodyPhoneNumber } }, res) => {
        const session = await (0, mongoose_1.startSession)();
        try {
            if (phone_number !== bodyPhoneNumber) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: 'Phone numbers do not match.',
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST,
                });
            }
            session.startTransaction();
            console.log("sessionusercontroller", session);
            await services_1.userService.deleteById(id, session);
            console.log(`User with ID ${id} deleted successfully.`);
            await services_1.resetPasswordService.deleteManyByUserId(id, session);
            await services_1.verificationService.deleteManyByUserId(id, session);
            await session.commitTransaction();
            session.endSession();
            console.log('User profile deleted successfully');
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (error) {
            winston_1.default.error(error);
            if (session.inTransaction()) {
                await session.abortTransaction();
                session.endSession();
            }
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
};
