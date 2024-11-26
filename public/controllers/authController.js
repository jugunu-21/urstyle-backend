"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const mongoose_1 = require("mongoose");
const http_status_codes_1 = require("http-status-codes");
const winston_1 = __importDefault(require("winston"));
const constants_1 = require("../constants");
const services_1 = require("../services");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cryptoString_1 = require("../utils/cryptoString");
const dates_1 = require("../utils/dates");
const dataSources_1 = require("../dataSources");
exports.authController = {
    signIn: async ({ body: { phone_number } }, res) => {
        try {
            const userbyphonenumber = await services_1.userService.getByphone_number(phone_number);
            if (!userbyphonenumber) {
                console.log("error");
                return res.status(http_status_codes_1.StatusCodes.NOT_FOUND).json({
                    message: http_status_codes_1.ReasonPhrases.NOT_FOUND,
                    status: http_status_codes_1.StatusCodes.NOT_FOUND
                });
            }
            const tokendata = {
                id: userbyphonenumber.id
            };
            const accessToken = jsonwebtoken_1.default.sign(tokendata, process.env.JWT_SECRET, {
                expiresIn: '48h'
            });
            const response = res.status(http_status_codes_1.StatusCodes.OK).json({
                data: accessToken,
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
            console.log("user");
            return response;
        }
        catch (error) {
            winston_1.default.error(error);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
    signUp: async ({ body: { phone_number } }, res) => {
        const session = await (0, mongoose_1.startSession)();
        try {
            const isUserExistbyphonenumber = await services_1.userService.isExistByphone_number(phone_number);
            if (isUserExistbyphonenumber) {
                return res.status(http_status_codes_1.StatusCodes.CONFLICT).json({
                    message: http_status_codes_1.ReasonPhrases.CONFLICT,
                    status: http_status_codes_1.StatusCodes.CONFLICT
                });
            }
            session.startTransaction();
            const user = await services_1.userService.create({
                phone_number
            }, session);
            const cryptoString = (0, cryptoString_1.createCryptoString)();
            const dateFromNow = (0, dates_1.createDateAddDaysFromNow)(constants_1.ExpiresInDays.Verification);
            const verification = await services_1.verificationService.create({
                userId: user.id,
                accessToken: cryptoString,
                expiresIn: dateFromNow
            }, session);
            await services_1.userService.addVerificationToUser({
                userId: user.id,
                verificationId: verification.id
            }, session);
            const tokendata = {
                id: user.id
            };
            const accessToken = jsonwebtoken_1.default.sign(tokendata, process.env.JWT_SECRET, {
                expiresIn: '48h'
            });
            await session.commitTransaction();
            session.endSession();
            const response = res.status(http_status_codes_1.StatusCodes.OK).json({
                data: accessToken,
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
            return response;
        }
        catch (error) {
            console.log(error);
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
    signOut: async ({ context: { user, accessToken } }, res) => {
        try {
            await dataSources_1.redis.client.set(`expiredToken:${accessToken}`, `${user.id}`, {
                EX: process.env.REDIS_TOKEN_EXPIRATION,
                NX: true
            });
            return res.status(http_status_codes_1.StatusCodes.OK).json({
                message: http_status_codes_1.ReasonPhrases.OK,
                status: http_status_codes_1.StatusCodes.OK
            });
        }
        catch (error) {
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
};
