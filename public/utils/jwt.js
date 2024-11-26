"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.jwtVerify = exports.jwtSign = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtSign = (id) => {
    const accessToken = jsonwebtoken_1.default.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRATION
    });
    return { accessToken };
};
exports.jwtSign = jwtSign;
const jwtVerify = ({ accessToken }) => {
    return jsonwebtoken_1.default.verify(accessToken, process.env.JWT_SECRET);
};
exports.jwtVerify = jwtVerify;
