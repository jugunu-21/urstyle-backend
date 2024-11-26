"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Images = exports.Image = void 0;
const sharp_1 = __importDefault(require("sharp"));
const mime_1 = __importDefault(require("mime"));
const path_1 = require("path");
const promises_1 = __importDefault(require("fs/promises"));
const paths_1 = require("../utils/paths");
class Image {
    image;
    sharpInstance;
    constructor(image) {
        this.image = image;
    }
    async sharp({ width, height } = {}) {
        const isResize = width || height;
        let fileName = this.image.filename;
        if (isResize) {
            fileName = `${fileName}_${[width, height].join('x')}`;
        }
        const conversionsPath = (0, path_1.join)(this.image.destination, 'conversions');
        const filePath = (0, path_1.join)(conversionsPath, `${fileName}.${mime_1.default.extension(this.image.mimetype)}`);
        const fileFullPath = (0, paths_1.joinRelativeToMainPath)(filePath);
        if (await this.isFileExist(fileFullPath)) {
            return filePath;
        }
        this.sharpInstance = (0, sharp_1.default)((0, paths_1.joinRelativeToMainPath)(this.image.path));
        if (isResize) {
            this.sharpInstance.resize(width, height);
        }
        await this.createDirectoryIfNeeded((0, paths_1.joinRelativeToMainPath)(conversionsPath));
        await this.saveFile(fileFullPath);
        return filePath;
    }
    async deleteFile() {
        try {
            if (await this.isFileExist(this.image.path)) {
                await promises_1.default.unlink(this.image.path);
            }
            const conversionsPath = (0, path_1.join)(this.image.destination, 'conversions');
            const conversionsFullPath = (0, paths_1.joinRelativeToMainPath)(conversionsPath);
            const files = await promises_1.default.readdir(conversionsPath);
            const promises = files
                .filter(file => {
                const fileFullPath = (0, path_1.join)(conversionsFullPath, file);
                return (new RegExp(this.image.filename).test(file) &&
                    this.isFileExist(fileFullPath));
            })
                .map(file => {
                const fileFullPath = (0, path_1.join)(conversionsFullPath, file);
                return promises_1.default.unlink(fileFullPath);
            });
            await Promise.all(promises);
        }
        catch {
            return null;
        }
    }
    async isFileExist(filePath) {
        try {
            return await promises_1.default.stat(filePath);
        }
        catch {
            return null;
        }
    }
    async createDirectoryIfNeeded(directoryPath) {
        try {
            await promises_1.default.access(directoryPath);
        }
        catch {
            await promises_1.default.mkdir(directoryPath, { recursive: true });
        }
    }
    async saveFile(fileFullPath) {
        try {
            await this.sharpInstance.toFile(fileFullPath);
        }
        catch {
            return null;
        }
    }
}
exports.Image = Image;
class Images {
    image;
    sharpInstance;
    constructor(image) {
        this.image = image;
    }
    async sharp({ width, height } = {}) {
        const isResize = width || height;
        let fileName = this.image['0'].filename;
        if (isResize) {
            fileName = `${fileName}_${[width, height].join('x')}`;
        }
        const conversionsPath = (0, path_1.join)(this.image['0'].destination, 'conversions');
        const filePath = (0, path_1.join)(conversionsPath, `${fileName}.${mime_1.default.extension(this.image['0'].mimetype)}`);
        const fileFullPath = (0, paths_1.joinRelativeToMainPath)(filePath);
        if (await this.isFileExist(fileFullPath)) {
            return filePath;
        }
        this.sharpInstance = (0, sharp_1.default)((0, paths_1.joinRelativeToMainPath)(this.image['0'].path));
        if (isResize) {
            this.sharpInstance.resize(width, height);
        }
        await this.createDirectoryIfNeeded((0, paths_1.joinRelativeToMainPath)(conversionsPath));
        await this.saveFile(fileFullPath);
        return filePath;
    }
    async deleteFile() {
        try {
            const fileFullPath = (0, paths_1.joinRelativeToMainPath)(this.image['0'].path);
            console.log("deletedfunct", fileFullPath);
            if (await this.isFileExist(fileFullPath)) {
                await promises_1.default.unlink(fileFullPath);
            }
            const conversionsPath = (0, path_1.join)(this.image['0'].destination, 'conversions');
            const conversionsFullPath = (0, paths_1.joinRelativeToMainPath)(conversionsPath);
            const files = await promises_1.default.readdir(conversionsFullPath);
            const promises = files
                .filter(file => {
                const fileFullPath = (0, path_1.join)(conversionsFullPath, file);
                return (new RegExp(this.image['0'].filename).test(file) &&
                    this.isFileExist(fileFullPath));
            })
                .map(file => {
                const fileFullPath = (0, path_1.join)(conversionsFullPath, file);
                return promises_1.default.unlink(fileFullPath);
            });
            await Promise.all(promises);
        }
        catch {
            return null;
        }
    }
    async isFileExist(filePath) {
        try {
            return await promises_1.default.stat(filePath);
        }
        catch {
            return null;
        }
    }
    async createDirectoryIfNeeded(directoryPath) {
        try {
            await promises_1.default.access(directoryPath);
        }
        catch {
            await promises_1.default.mkdir(directoryPath, { recursive: true });
        }
    }
    async saveFile(fileFullPath) {
        try {
            await this.sharpInstance.toFile(fileFullPath);
        }
        catch {
            return null;
        }
    }
}
exports.Images = Images;
