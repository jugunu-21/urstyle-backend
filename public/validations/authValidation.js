"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authValidation = void 0;
const validator_1 = __importDefault(require("validator"));
const http_status_codes_1 = require("http-status-codes");
const winston_1 = __importDefault(require("winston"));
exports.authValidation = {
    signIn: (req, res, next) => {
        try {
            if (!req.body.phone_number) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            console.log("has the phone number for validtaion ");
            return next();
        }
        catch (error) {
            winston_1.default.error(error);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
    signUp: (req, res, next) => {
        try {
            if (!req.body.phone_number) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            return next();
        }
        catch (error) {
            winston_1.default.error(error);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
    resetPassword: (req, res, next) => {
        try {
            if (!req.body.email) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            let normalizedEmail = req.body.email && validator_1.default.normalizeEmail(req.body.email);
            if (normalizedEmail) {
                normalizedEmail = validator_1.default.trim(normalizedEmail);
            }
            if (!normalizedEmail ||
                !validator_1.default.isEmail(normalizedEmail, { allow_utf8_local_part: false })) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            Object.assign(req.body, { email: normalizedEmail });
            return next();
        }
        catch (error) {
            winston_1.default.error(error);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
    newPassword: (req, res, next) => {
        try {
            if (!req.body.password ||
                !validator_1.default.isLength(req.body.password, { min: 6, max: 48 })) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            return next();
        }
        catch (error) {
            winston_1.default.error(error);
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    }
};
