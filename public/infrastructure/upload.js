"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadMultipleImages = void 0;
const multer_1 = __importDefault(require("multer"));
const constants_1 = require("../constants");
const maths_1 = require("../utils/maths");
const paths_1 = require("../utils/paths");
const fileFilter = (req, file, cb) => {
    if (/^data:image\/jpeg;base64,.*/.test(file.buffer.toString())) {
        console.log('sucess');
        return cb(null, true);
    }
    console.log('sucess');
    return cb(new Error(`Only files are allowed.`));
};
const upload = (0, multer_1.default)({
    dest: (0, paths_1.joinRelativeToMainPath)(process.env.STORAGE_PATH),
    limits: { fileSize: (0, maths_1.mbToBytes)(constants_1.ImageSizeInMb.Ten) },
});
console.log("upload", upload);
exports.uploadMultipleImages = upload.array('image', 10);
