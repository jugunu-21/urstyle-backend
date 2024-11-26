"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = void 0;
const cors_1 = __importDefault(require("cors"));
const http_status_codes_1 = require("http-status-codes");
exports.corsMiddleware = (0, cors_1.default)({
    origin: process.env.CLIENT_URL || 'https://urtsyle.vercel.app',
    credentials: true,
    optionsSuccessStatus: http_status_codes_1.StatusCodes.OK
});
