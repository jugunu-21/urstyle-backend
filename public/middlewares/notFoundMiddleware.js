"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notFoundMiddleware = void 0;
const http_status_codes_1 = require("http-status-codes");
const notFoundMiddleware = (_, res) => {
    res
        .status(http_status_codes_1.StatusCodes.NOT_FOUND)
        .json({ message: http_status_codes_1.ReasonPhrases.NOT_FOUND, status: http_status_codes_1.StatusCodes.NOT_FOUND });
};
exports.notFoundMiddleware = notFoundMiddleware;
