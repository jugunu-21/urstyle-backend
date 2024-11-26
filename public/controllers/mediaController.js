"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mediaController = void 0;
const http_status_codes_1 = require("http-status-codes");
const winston_1 = __importDefault(require("winston"));
const services_1 = require("../services");
const image_1 = require("../infrastructure/image");
const paths_1 = require("../utils/paths");
const fs_1 = __importDefault(require("fs"));
const cloudinary_1 = require("../utils/cloudinary");
exports.mediaController = {
    imageUpload: async ({ file }, res) => {
        try {
            const filepath = file?.path;
            if (filepath) {
                const path = (0, paths_1.joinRelativeToMainPath)(filepath);
                const fileBuffer = fs_1.default.readFileSync(path);
                const url = await (0, cloudinary_1.uploadFileToCloudinary)(fileBuffer);
                const media = await services_1.mediaService.create(file);
                await new image_1.Image(file).deleteFile();
                return res.status(http_status_codes_1.StatusCodes.OK).json({
                    data: { url: url },
                    message: http_status_codes_1.ReasonPhrases.OK,
                    status: http_status_codes_1.StatusCodes.OK
                });
            }
            await new image_1.Image(file).deleteFile();
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
        catch (error) {
            winston_1.default.error(error);
            await new image_1.Image(file).deleteFile();
            return res.status(http_status_codes_1.StatusCodes.BAD_REQUEST).json({
                message: http_status_codes_1.ReasonPhrases.BAD_REQUEST,
                status: http_status_codes_1.StatusCodes.BAD_REQUEST
            });
        }
    },
};
