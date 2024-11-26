"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mongoose = void 0;
const mongoose_1 = require("mongoose");
const winston_1 = __importDefault(require("winston"));
const mongooseConfig_1 = require("./mongooseConfig");
exports.mongoose = {
    run: async () => {
        try {
            (0, mongooseConfig_1.mongooseConfig)();
            return await (0, mongoose_1.connect)(process.env.MONGODB_URI);
        }
        catch (error) {
            winston_1.default.error(error);
        }
    },
    stop: async () => {
        try {
            return await mongoose_1.connection.destroy();
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
};
