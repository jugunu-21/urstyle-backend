"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadSingleImage = exports.uploadMultipleImages = void 0;
const multer_1 = __importDefault(require("multer"));
const constants_1 = require("../constants");
const maths_1 = require("../utils/maths");
const paths_1 = require("../utils/paths");
const fileFilter = (_, file, cb) => {
    const mimetypes = Object.values(constants_1.Mimetype);
    if (!mimetypes.includes(file.mimetype)) {
        console.log("fileeee");
        return cb(new Error(`Only ${mimetypes} files are allowed.`));
    }
    cb(null, true);
};
const upload = (0, multer_1.default)({
    dest: (0, paths_1.joinRelativeToMainPath)(process.env.STORAGE_PATH),
    limits: { fileSize: (0, maths_1.mbToBytes)(constants_1.ImageSizeInMb.Ten) },
});
console.log("upload", upload);
exports.uploadMultipleImages = upload.array('image', 10);
exports.uploadSingleImage = upload.single('files');
