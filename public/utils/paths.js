"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cloudUrlId = exports.appUrl = exports.joinRelativeToMainPath = void 0;
const path_1 = require("path");
const joinRelativeToMainPath = (path = '') => {
    const { filename } = require.main || {};
    if (!filename)
        return path;
    return (0, path_1.join)((0, path_1.dirname)(filename), path);
};
exports.joinRelativeToMainPath = joinRelativeToMainPath;
const appUrl = (path = '') => `${process.env.APP_URL}/src/${path}`;
exports.appUrl = appUrl;
const cloudUrlId = (url) => {
    const parts = url.split('/');
    const fileName = parts.pop();
    const publicId = fileName?.split('.')[0];
    return publicId;
};
exports.cloudUrlId = cloudUrlId;
