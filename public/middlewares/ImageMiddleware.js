"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ImageMiddleware = exports.uploadSingleImageMiddleware = void 0;
const path_1 = require("path");
const http_status_codes_1 = require("http-status-codes");
const upload_1 = require("../infrastructure/upload");
const cloudinary_1 = require("../utils/cloudinary");
const image_1 = require("../infrastructure/image");
const uploadSingleImageMiddleware = (req, res, next) => {
    try {
        (0, upload_1.uploadSingleImage)(req, res, err => {
            const file = req.file;
            console.log("filee", file);
            if (err || !file) {
                console.log("errrorss");
                return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                    message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                    status: http_status_codes_1.StatusCodes.BAD_REQUEST
                });
            }
            console.log("hhh");
            Object.assign(req, {
                file: {
                    ...file,
                    destination: process.env.STORAGE_PATH,
                    path: (0, path_1.join)(process.env.STORAGE_PATH, file.filename)
                }
            });
            console.log("object", req.file);
            return next();
        });
    }
    catch (error) {
        console.log("hhheee");
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
            status: http_status_codes_1.StatusCodes.BAD_REQUEST
        });
    }
};
exports.uploadSingleImageMiddleware = uploadSingleImageMiddleware;
const ImageMiddleware = (req, res, next) => {
    try {
        console.log("heyy");
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
            console.log("heyyuu", req.file);
            if (files['0']) {
                const file = files['0'];
                const url = await (0, cloudinary_1.uploadCloudinary)(file.path);
                req.body.image = url;
                await new image_1.Image(file).deleteFile();
                return next();
            }
            return next();
        });
    }
    catch (error) {
        console.log("hhheee");
        return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
            message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
            status: http_status_codes_1.StatusCodes.BAD_REQUEST
        });
    }
};
exports.ImageMiddleware = ImageMiddleware;
