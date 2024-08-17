"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = void 0;
const redis_1 = require("redis");
const winston_1 = __importDefault(require("winston"));
class Redis {
    static instance;
    redisUri;
    client;
    constructor(redisUri) {
        this.redisUri = redisUri;
        this.createClient();
    }
    createClient() {
        try {
            this.client = (0, redis_1.createClient)({
                url: this.redisUri
            });
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
    async run() {
        try {
            await this.client.connect();
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
    async stop() {
        try {
            await this.client.disconnect();
        }
        catch (error) {
            winston_1.default.error(error);
        }
    }
    static getInstance() {
        if (!Redis.instance) {
            Redis.instance = new Redis(process.env.REDIS_URI);
        }
        return Redis.instance;
    }
}
exports.redis = Redis.getInstance();
