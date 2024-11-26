"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston_1 = require("winston");
(0, winston_1.configure)({
    format: winston_1.format.combine(winston_1.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), winston_1.format.json()),
    transports: [new winston_1.transports.File({ filename: process.env.API_LOG_FILENAME })]
});
