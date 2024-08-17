"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.redis = exports.mongoose = void 0;
var mongoose_1 = require("./mongoose");
Object.defineProperty(exports, "mongoose", { enumerable: true, get: function () { return mongoose_1.mongoose; } });
var redis_1 = require("./redis");
Object.defineProperty(exports, "redis", { enumerable: true, get: function () { return redis_1.redis; } });
