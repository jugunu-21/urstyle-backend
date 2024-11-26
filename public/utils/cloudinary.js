"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadCloudinary = exports.deleteFromCloudinaryWithUrl = exports.uploadFileToCloudinary = void 0;
const cloudinary_1 = require("cloudinary");
const fs_1 = __importDefault(require("fs"));
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
exports.default = cloudinary_1.v2;
async function uploadFileToCloudinary(buffer) {
    return new Promise((resolve, reject) => {
        cloudinary_1.v2.uploader.upload_stream({
            resource_type: 'auto',
        }, (error, result) => {
            if (error) {
                console.error('Error uploading file to Cloudinary:', error);
                reject(error);
            }
            else {
                resolve(result?.url);
            }
        }).end(buffer);
    });
}
exports.uploadFileToCloudinary = uploadFileToCloudinary;
async function deleteFromCloudinaryWithUrl(url) {
    try {
        const parts = url.split('/');
        const fileName = parts.pop();
        const publicId = fileName?.split('.')[0];
        if (publicId) {
            const result = await cloudinary_1.v2.uploader.destroy(publicId);
            console.log("sucessfully deleted from cloudinary", result);
            return true;
        }
        else {
            console.error('Public ID is undefined');
            return false;
        }
    }
    catch (error) {
        console.error('Error deleting file from Cloudinary:', error);
        return false;
    }
}
exports.deleteFromCloudinaryWithUrl = deleteFromCloudinaryWithUrl;
async function uploadCloudinary(filepath) {
    const fileBuffer = fs_1.default.readFileSync(filepath);
    const url = await uploadFileToCloudinary(fileBuffer);
    return url;
}
exports.uploadCloudinary = uploadCloudinary;
