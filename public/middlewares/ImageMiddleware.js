"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageMiddleware = void 0;
const path_1 = require("path");
const http_status_codes_1 = require("http-status-codes");
const upload_1 = require("../infrastructure/upload");
const ImageMiddleware = (req, res, next) => {
    try {
        (0, upload_1.uploadMultipleImages)(req, res, async (err) => {
            const files = req.files;
            if (err || !files) {
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            Object.assign(req, {
                file: {
                    ...files,
                    destination: process.env.STORAGE_PATH,
                    paths: files.map(file => (0, path_1.join)(process.env.STORAGE_PATH, file.filename))
                }
            });
            return next();
        });
    }
    catch (error) {
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
            status: http_status_codes_1.StatusCodes.BAD_REQUEST
        });
    }
};
exports.ImageMiddleware = ImageMiddleware;
