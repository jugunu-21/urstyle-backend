"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const validator_1 = __importDefault(require("validator"));
const http_status_codes_1 = require("http-status-codes");
const winston_1 = __importDefault(require("winston"));
exports.userValidation = {
    verificationRequest: (req, res, next) => {
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
    updateProfile: (req, res, next) => {
        try {
            if (!req.body.firstName || !req.body.lastName) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            const trimemdFirstName = validator_1.default.trim(req.body.firstName);
            const trimemdLastName = validator_1.default.trim(req.body.lastName);
            if (!validator_1.default.isLength(trimemdFirstName, { min: 2, max: 48 }) ||
                !validator_1.default.isLength(trimemdLastName, { min: 2, max: 48 })) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            Object.assign(req.body, {
                firstName: trimemdFirstName,
                lastName: trimemdLastName
            });
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
    updateEmail: (req, res, next) => {
        try {
            if (!req.body.email || !req.body.password) {
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
    updatePassword: ({ body: { oldPassword, newPassword } }, res, next) => {
        try {
            if (!oldPassword ||
                !newPassword ||
                !validator_1.default.isLength(newPassword, { min: 6, max: 48 })) {
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
    updateAvatar: ({ body: { imageId } }, res, next) => {
        try {
            if (!imageId) {
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
    deleteProfile: ({ body: { phone_number } }, res, next) => {
        try {
            if (!phone_number) {
                console.log("Phone number is required");
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
